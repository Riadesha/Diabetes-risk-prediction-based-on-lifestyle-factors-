"""
Early-Stage Diabetes Risk Test — FastAPI backend.

Loads the trained XGBoost pipeline + label encoder and exposes a /predict
endpoint. The engineered features created during training (bmi_category,
age_group, risk_flag_count) are recomputed here so the input matches exactly
what the model was trained on.
"""
from pathlib import Path
from enum import Enum

import joblib
import numpy as np
import pandas as pd
import shap
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# --------------------------------------------------------------------------- #
# Load model artifacts once at startup
# --------------------------------------------------------------------------- #
MODEL_DIR = Path(__file__).parent / "models"
model = joblib.load(MODEL_DIR / "diabetes_risk_model.joblib")
label_encoder = joblib.load(MODEL_DIR / "label_encoder.joblib")

# SHAP explainer over the XGBoost step (built once — reused per request).
_prep = model.named_steps["prep"]
_clf = model.named_steps["clf"]
_explainer = shap.TreeExplainer(_clf)
_transformed_names = _prep.get_feature_names_out()

app = FastAPI(
    title="Early-Stage Diabetes Risk API",
    description="Predicts early-stage diabetes risk (Low / Medium / High).",
    version="1.0.0",
)

# Original feature columns (before one-hot encoding), with display labels.
FEATURE_LABELS = {
    "age": "Age",
    "bmi": "BMI",
    "risk_flag_count": "Risk Flag Count",
    "gender": "Gender",
    "physical_activity": "Physical Activity",
    "smoking_habit": "Smoking Habit",
    "family_history": "Family History",
    "blood_pressure": "Blood Pressure",
    "food_habit": "Food Habit",
    "hypertension": "Hypertension",
    "heart_disease": "Heart Disease",
    "bmi_category": "BMI Category",
    "age_group": "Age Group",
}


# For each transformed (one-hot) column, which original feature it belongs to.
_ORIGINALS_BY_LEN = sorted(FEATURE_LABELS.keys(), key=len, reverse=True)


def _transformed_to_original(tname: str) -> str:
    """Map a transformed column name ('cat__bmi_category_Obese') back to its
    original feature ('bmi_category')."""
    stripped = tname.split("__", 1)[-1]          # drop 'num__' / 'cat__'
    for orig in _ORIGINALS_BY_LEN:
        if stripped == orig or stripped.startswith(orig + "_"):
            return orig
    return stripped


def aggregate_by_original(values):
    """Sum per-column values into per-original-feature totals."""
    totals = {name: 0.0 for name in FEATURE_LABELS}
    for tname, val in zip(_transformed_names, values):
        totals[_transformed_to_original(tname)] += float(val)
    return totals


def compute_feature_importance():
    """Aggregate the XGBoost importances back to the original features."""
    totals = aggregate_by_original(_clf.feature_importances_)
    ranked = sorted(totals.items(), key=lambda kv: kv[1], reverse=True)
    return [
        {"feature": FEATURE_LABELS[k], "importance": round(v, 4)}
        for k, v in ranked if v > 0
    ]


FEATURE_IMPORTANCE = compute_feature_importance()

# Allow the React dev server (and any origin during development) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # tighten to your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------------------------------- #
# Input schema — values must match the categories used in training
# --------------------------------------------------------------------------- #
class Gender(str, Enum):
    male = "Male"
    female = "Female"


class Activity(str, Enum):
    low = "Low"
    moderate = "Moderate"
    high = "High"


class Smoking(str, Enum):
    never = "Never"
    former = "Former"
    current = "Current"


class YesNo(str, Enum):
    yes = "Yes"
    no = "No"


class BloodPressure(str, Enum):
    normal = "Normal"
    elevated = "Elevated"
    high = "High"


class FoodHabit(str, Enum):
    healthy = "Healthy"
    average = "Average"
    unhealthy = "Unhealthy"


class PatientInput(BaseModel):
    gender: Gender
    age: int = Field(..., ge=1, le=120, description="Age in years")
    bmi: float = Field(..., ge=10, le=70, description="Body Mass Index")
    physical_activity: Activity
    smoking_habit: Smoking
    family_history: YesNo
    blood_pressure: BloodPressure
    food_habit: FoodHabit
    hypertension: YesNo
    heart_disease: YesNo

    model_config = {
        "json_schema_extra": {
            "example": {
                "gender": "Male",
                "age": 55,
                "bmi": 31.5,
                "physical_activity": "Low",
                "smoking_habit": "Current",
                "family_history": "Yes",
                "blood_pressure": "High",
                "food_habit": "Unhealthy",
                "hypertension": "Yes",
                "heart_disease": "No",
            }
        }
    }


# --------------------------------------------------------------------------- #
# Feature engineering — MUST match the training notebook exactly
# --------------------------------------------------------------------------- #
def build_features(data: PatientInput) -> pd.DataFrame:
    df = pd.DataFrame([{
        "gender": data.gender.value,
        "age": data.age,
        "bmi": data.bmi,
        "physical_activity": data.physical_activity.value,
        "smoking_habit": data.smoking_habit.value,
        "family_history": data.family_history.value,
        "blood_pressure": data.blood_pressure.value,
        "food_habit": data.food_habit.value,
        "hypertension": data.hypertension.value,
        "heart_disease": data.heart_disease.value,
    }])

    df["bmi_category"] = pd.cut(
        df["bmi"], bins=[0, 18.5, 25, 30, 100],
        labels=["Underweight", "Normal", "Overweight", "Obese"],
    )
    df["age_group"] = pd.cut(
        df["age"], bins=[0, 30, 45, 60, 120],
        labels=["Young", "Middle", "Senior", "Elderly"],
    )
    df["risk_flag_count"] = (
        (df["family_history"] == "Yes").astype(int)
        + (df["hypertension"] == "Yes").astype(int)
        + (df["heart_disease"] == "Yes").astype(int)
        + (df["blood_pressure"] == "High").astype(int)
    )
    return df


# --------------------------------------------------------------------------- #
# SHAP explanation — contribution of each factor toward HIGHER risk
# --------------------------------------------------------------------------- #
RISK_CLASS = "High"
_HIGH_IDX = list(label_encoder.classes_).index(RISK_CLASS)


def shap_risk_contributions(X: pd.DataFrame) -> dict:
    """Signed SHAP contribution of each original feature toward P(High risk).
    Positive => pushes risk up, negative => pulls risk down."""
    Xt = _prep.transform(X)
    sv = np.array(_explainer.shap_values(Xt))     # (1, n_features, n_classes)
    per_col = sv[0, :, _HIGH_IDX]
    return aggregate_by_original(per_col)


# --------------------------------------------------------------------------- #
# Personalized recommendations — rule-based, ordered by SHAP risk impact
# --------------------------------------------------------------------------- #
def _recommendation_rules(d: "PatientInput"):
    """Return (feature_keys, recommendation) for each triggered rule.
    feature_keys are used to order recs by their SHAP risk contribution."""
    rules = []
    if d.bmi >= 25:
        rules.append((["bmi", "bmi_category"], {
            "icon": "⚖️", "title": "Work toward a healthy weight",
            "text": f"Your BMI is {d.bmi:.1f}. Losing even 5–7% of body weight can "
                    "substantially lower diabetes risk — aim for gradual, sustainable changes.",
        }))
    if d.physical_activity.value == "Low":
        rules.append((["physical_activity"], {
            "icon": "🏃", "title": "Move more",
            "text": "Aim for at least 150 minutes of moderate activity per week. Even "
                    "short walks after meals help control blood sugar.",
        }))
    elif d.physical_activity.value == "Moderate":
        rules.append((["physical_activity"], {
            "icon": "🚶", "title": "Stay consistently active",
            "text": "You're moderately active — building toward regular, higher-intensity "
                    "exercise can lower your risk further.",
        }))
    if d.food_habit.value in ("Unhealthy", "Average"):
        rules.append((["food_habit"], {
            "icon": "🥗", "title": "Improve your diet",
            "text": "Build meals around vegetables, whole grains, and lean protein, and "
                    "limit sugary drinks and refined carbohydrates.",
        }))
    if d.smoking_habit.value == "Current":
        rules.append((["smoking_habit"], {
            "icon": "🚭", "title": "Consider quitting smoking",
            "text": "Smoking increases insulin resistance and the risk of complications. "
                    "Quitting improves your risk over time.",
        }))
    if d.blood_pressure.value in ("Elevated", "High"):
        rules.append((["blood_pressure"], {
            "icon": "❤️", "title": "Manage your blood pressure",
            "text": "Raised blood pressure often accompanies diabetes. Reduce salt, stay "
                    "active, and monitor it regularly.",
        }))
    if d.hypertension.value == "Yes":
        rules.append((["hypertension"], {
            "icon": "🩺", "title": "Keep hypertension controlled",
            "text": "Follow your treatment plan and monitor blood pressure to reduce "
                    "combined cardiovascular and diabetes risk.",
        }))
    if d.family_history.value == "Yes":
        rules.append((["family_history"], {
            "icon": "👪", "title": "Screen regularly",
            "text": "A family history of diabetes raises your risk. Ask your doctor about "
                    "periodic blood-glucose screening.",
        }))
    if d.heart_disease.value == "Yes":
        rules.append((["heart_disease"], {
            "icon": "💚", "title": "Prioritise heart health",
            "text": "Existing heart disease is linked with diabetes risk. Work closely with "
                    "your doctor on a combined care plan.",
        }))
    return rules


def generate_recommendations(d: "PatientInput", risk_contrib: dict):
    triggered = _recommendation_rules(d)
    if not triggered:
        return [{
            "icon": "✅", "title": "Keep up the healthy habits",
            "text": "Your profile shows low-risk lifestyle factors. Maintain regular "
                    "activity, a balanced diet, and routine check-ups.",
        }]
    # Order by the strongest SHAP risk contribution among a rule's features.
    def weight(keys):
        return max(risk_contrib.get(k, 0.0) for k in keys)
    triggered.sort(key=lambda r: weight(r[0]), reverse=True)
    return [rec for _, rec in triggered]


# --------------------------------------------------------------------------- #
# Routes
# --------------------------------------------------------------------------- #
@app.get("/health")
def health():
    return {"status": "ok", "classes": list(label_encoder.classes_)}


@app.get("/feature-importance")
def feature_importance():
    return {"features": FEATURE_IMPORTANCE}


@app.post("/predict")
def predict(data: PatientInput):
    X = build_features(data)

    proba = model.predict_proba(X)[0]
    classes = label_encoder.classes_

    probabilities = {cls: round(float(p), 4) for cls, p in zip(classes, proba)}
    top_idx = int(proba.argmax())

    return {
        "prediction": str(classes[top_idx]),
        "confidence": round(float(proba[top_idx]), 4),
        "probabilities": probabilities,
    }


@app.post("/explain")
def explain(data: PatientInput):
    X = build_features(data)

    proba = model.predict_proba(X)[0]
    classes = label_encoder.classes_
    top_idx = int(proba.argmax())

    risk_contrib = shap_risk_contributions(X)

    # Top factors by absolute impact on risk (skip ~zero contributions).
    contributions = [
        {
            "feature": FEATURE_LABELS[k],
            "value": round(v, 4),
            "direction": "increase" if v > 0 else "decrease",
        }
        for k, v in sorted(risk_contrib.items(), key=lambda kv: abs(kv[1]), reverse=True)
        if abs(v) >= 0.005
    ][:7]

    recommendations = generate_recommendations(data, risk_contrib)

    return {
        "prediction": str(classes[top_idx]),
        "risk_class": RISK_CLASS,
        "contributions": contributions,
        "recommendations": recommendations,
    }
