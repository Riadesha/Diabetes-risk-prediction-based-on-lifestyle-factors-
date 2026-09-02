// One entry = one screen in the risk-test wizard.
// `type` drives which input renders. Option values MUST match the dataset.

export const QUESTIONS = [
  {
    id: 'gender',
    type: 'choice',
    title: "What is the patient's gender?",
    help: 'Biological sex used by the model.',
    options: [
      { value: 'Male', label: 'Male', icon: '👨' },
      { value: 'Female', label: 'Female', icon: '👩' },
    ],
  },
  {
    id: 'age',
    type: 'slider',
    title: 'How old is the patient?',
    help: 'Diabetes risk rises with age.',
    min: 18, max: 80, step: 1, unit: 'years',
  },
  {
    id: 'bmi',
    type: 'slider',
    title: 'What is the Body Mass Index (BMI)?',
    help: 'BMI = weight(kg) / height(m)². Normal is 18.5–24.9.',
    min: 15, max: 50, step: 0.1, unit: 'kg/m²', decimals: 1,
  },
  {
    id: 'physical_activity',
    type: 'choice',
    title: 'How active is the patient?',
    help: 'Regular activity lowers diabetes risk.',
    options: [
      { value: 'Low', label: 'Low', icon: '🛋️' },
      { value: 'Moderate', label: 'Moderate', icon: '🚶' },
      { value: 'High', label: 'High', icon: '🏃' },
    ],
  },
  {
    id: 'smoking_habit',
    type: 'choice',
    title: 'Smoking habit?',
    help: 'Smoking is linked to insulin resistance.',
    options: [
      { value: 'Never', label: 'Never', icon: '🚭' },
      { value: 'Former', label: 'Former', icon: '🕰️' },
      { value: 'Current', label: 'Current', icon: '🚬' },
    ],
  },
  {
    id: 'food_habit',
    type: 'choice',
    title: 'How would you describe the diet?',
    help: 'Diet quality strongly affects blood sugar.',
    options: [
      { value: 'Healthy', label: 'Healthy', icon: '🥗' },
      { value: 'Average', label: 'Average', icon: '🍽️' },
      { value: 'Unhealthy', label: 'Unhealthy', icon: '🍔' },
    ],
  },
  {
    id: 'blood_pressure',
    type: 'choice',
    title: 'Blood pressure level?',
    help: 'Elevated/high BP often accompanies diabetes.',
    options: [
      { value: 'Normal', label: 'Normal', icon: '💚' },
      { value: 'Elevated', label: 'Elevated', icon: '💛' },
      { value: 'High', label: 'High', icon: '❤️' },
    ],
  },
  {
    id: 'family_history',
    type: 'boolean',
    title: 'Family history of diabetes?',
    help: 'A parent or sibling with diabetes raises risk.',
  },
  {
    id: 'hypertension',
    type: 'boolean',
    title: 'Diagnosed with hypertension?',
    help: 'Chronic high blood pressure.',
  },
  {
    id: 'heart_disease',
    type: 'boolean',
    title: 'Any heart disease?',
    help: 'Cardiovascular disease is a related risk factor.',
  },
]

export const INITIAL_ANSWERS = {
  gender: 'Male',
  age: 45,
  bmi: 25,
  physical_activity: 'Moderate',
  smoking_habit: 'Never',
  food_habit: 'Average',
  blood_pressure: 'Normal',
  family_history: 'No',
  hypertension: 'No',
  heart_disease: 'No',
}
