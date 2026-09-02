# Early-Stage Diabetes Risk Test

A full-stack web app that predicts early-stage diabetes risk (**Low / Medium / High**)
using a trained XGBoost model.

- **Backend:** FastAPI (Python) — serves the trained model at a `/predict` endpoint
- **Frontend:** React (Vite) — form UI + risk visualization
- **Model:** XGBoost pipeline (preprocessing + SMOTE + classifier), trained in Colab

```
thesis_p/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── requirements.txt
│   ├── venv/                # Python virtual environment
│   └── models/
│       ├── diabetes_risk_model.joblib
│       └── label_encoder.joblib
└── frontend/                # React (Vite) app
```

## Running the app

You need **two terminals** — one for the backend, one for the frontend.

### 1. Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate          # first time only: python3 -m venv venv && pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

- API runs at http://127.0.0.1:8000
- Interactive API docs (great for a demo): http://127.0.0.1:8000/docs

### 2. Frontend (Terminal 2)

```bash
cd frontend
npm install                       # first time only
npm run dev
```

- Open the app at http://127.0.0.1:5173

## How it works

1. The React form collects patient details (age, BMI, lifestyle, medical history).
2. On submit, it sends a JSON `POST` to the FastAPI `/predict` endpoint.
3. The backend recreates the engineered features (`bmi_category`, `age_group`,
   `risk_flag_count`) — exactly as during training — and runs the XGBoost pipeline.
4. It returns the predicted risk level + probability for each class.
5. The frontend shows the verdict and a probability bar chart.

> For educational/screening purposes only — not a medical diagnosis.
