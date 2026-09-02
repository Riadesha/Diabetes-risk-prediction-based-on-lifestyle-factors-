// Educational content for the Knowledge Hub and FAQ pages.
// General health information — not medical advice.

export const ARTICLES = [
  {
    id: 'types-of-diabetes',
    title: 'The Types of Diabetes Explained',
    category: 'Basics',
    icon: '🩸',
    readTime: '5 min',
    summary:
      'Type 1, Type 2, gestational, and prediabetes — what makes them different and who they affect.',
    body: [
      { type: 'p', text: 'Diabetes is a group of conditions where blood glucose (sugar) stays too high because the body cannot make enough insulin, or cannot use it effectively. There are several distinct types.' },
      { type: 'h', text: 'Type 1 Diabetes' },
      { type: 'p', text: 'An autoimmune condition where the immune system attacks the insulin-producing cells in the pancreas. It usually appears in childhood or early adulthood and always requires insulin therapy. It is not caused by lifestyle.' },
      { type: 'h', text: 'Type 2 Diabetes' },
      { type: 'p', text: 'The most common form (~90% of cases). The body becomes resistant to insulin and/or does not produce enough. It develops gradually and is strongly linked to weight, activity level, diet, and genetics. It can often be prevented or delayed.' },
      { type: 'h', text: 'Gestational Diabetes' },
      { type: 'p', text: 'High blood sugar that develops during pregnancy and usually resolves after birth. It raises the mother’s future risk of Type 2 diabetes.' },
      { type: 'h', text: 'Prediabetes' },
      { type: 'p', text: 'Blood sugar is higher than normal but not yet in the diabetes range. It is a critical warning stage — with lifestyle changes, many people return to normal levels.' },
      { type: 'callout', text: 'This project focuses on early-stage risk for Type 2 diabetes, which is the most preventable form.' },
    ],
  },
  {
    id: 'warning-signs',
    title: 'Early Warning Signs You Should Not Ignore',
    category: 'Symptoms',
    icon: '⚠️',
    readTime: '4 min',
    summary:
      'The subtle early symptoms of high blood sugar — from constant thirst to slow-healing wounds.',
    body: [
      { type: 'p', text: 'Early-stage diabetes often develops quietly. Recognising these signs early can lead to timely testing and treatment.' },
      { type: 'h', text: 'Common early symptoms' },
      { type: 'ul', items: [
        'Frequent urination, especially at night',
        'Increased thirst and a dry mouth',
        'Unexplained tiredness or fatigue',
        'Increased hunger even after eating',
        'Blurred vision',
        'Slow-healing cuts or wounds',
        'Tingling or numbness in hands or feet',
        'Unintended weight loss',
      ] },
      { type: 'callout', text: 'If several of these appear together, ask a doctor for a simple blood glucose test. Early detection dramatically improves outcomes.' },
    ],
  },
  {
    id: 'lifestyle-prevention',
    title: 'Lifestyle Changes That Lower Your Risk',
    category: 'Prevention',
    icon: '🌱',
    readTime: '6 min',
    summary:
      'Evidence-based habits — movement, sleep, and stress — that meaningfully reduce Type 2 diabetes risk.',
    body: [
      { type: 'p', text: 'For Type 2 diabetes, everyday habits matter enormously. Studies show that structured lifestyle changes can cut the risk of progressing from prediabetes to diabetes by more than half.' },
      { type: 'h', text: 'Move more' },
      { type: 'p', text: 'Aim for at least 150 minutes of moderate activity per week — brisk walking counts. Muscle uses glucose, so even short walks after meals help control blood sugar.' },
      { type: 'h', text: 'Reach a healthy weight' },
      { type: 'p', text: 'Losing just 5–7% of body weight substantially lowers risk for people who are overweight. Small, sustainable changes beat crash diets.' },
      { type: 'h', text: 'Sleep and stress' },
      { type: 'p', text: 'Poor sleep and chronic stress raise blood sugar through hormonal effects. Aim for 7–9 hours of sleep and build in daily recovery time.' },
      { type: 'h', text: 'Avoid tobacco' },
      { type: 'p', text: 'Smoking increases insulin resistance and the risk of complications. Quitting improves risk within years.' },
    ],
  },
  {
    id: 'eating-well',
    title: 'Eating Well to Balance Blood Sugar',
    category: 'Diet',
    icon: '🥗',
    readTime: '5 min',
    summary:
      'A practical guide to foods that stabilise blood sugar and the ones to enjoy in moderation.',
    body: [
      { type: 'p', text: 'No single food causes or cures diabetes, but overall eating patterns have a large effect on blood sugar and weight.' },
      { type: 'h', text: 'Build meals around these' },
      { type: 'ul', items: [
        'Vegetables and leafy greens',
        'Whole grains (oats, brown rice, whole wheat)',
        'Beans, lentils, and legumes',
        'Lean protein (fish, poultry, tofu, eggs)',
        'Nuts, seeds, and healthy fats',
      ] },
      { type: 'h', text: 'Enjoy in moderation' },
      { type: 'ul', items: [
        'Sugary drinks and desserts',
        'White bread, white rice, refined flour',
        'Fried and heavily processed foods',
        'Packaged snacks high in added sugar',
      ] },
      { type: 'callout', text: 'A simple rule: fill half your plate with vegetables, a quarter with whole grains, and a quarter with protein.' },
    ],
  },
  {
    id: 'know-your-numbers',
    title: 'Know Your Numbers: BMI, Blood Pressure & Risk',
    category: 'Risk Factors',
    icon: '📊',
    readTime: '4 min',
    summary:
      'Understand the key measurements this tool uses — and what healthy ranges look like.',
    body: [
      { type: 'p', text: 'Several measurable factors combine to shape diabetes risk. Knowing your numbers helps you act early.' },
      { type: 'h', text: 'BMI (Body Mass Index)' },
      { type: 'ul', items: [
        'Under 18.5 — underweight',
        '18.5–24.9 — healthy range',
        '25–29.9 — overweight',
        '30 and above — obese (higher risk)',
      ] },
      { type: 'h', text: 'Blood pressure' },
      { type: 'p', text: 'Normal is around 120/80 mmHg. Elevated and high blood pressure frequently occur alongside diabetes and multiply cardiovascular risk.' },
      { type: 'h', text: 'Other factors' },
      { type: 'p', text: 'Family history, physical activity, smoking, and existing heart disease all contribute. This tool weighs these together to estimate an overall risk level.' },
    ],
  },
  {
    id: 'about-the-model',
    title: 'How This Risk Test Works',
    category: 'Technology',
    icon: '🤖',
    readTime: '3 min',
    summary:
      'A look under the hood — the machine-learning model powering the prediction.',
    body: [
      { type: 'p', text: 'This risk test is powered by a machine-learning model called XGBoost, trained on 5,000 records of health and lifestyle data.' },
      { type: 'h', text: 'What it does' },
      { type: 'p', text: 'The model learned patterns linking factors such as BMI, activity, age, and medical history to three risk levels: Low, Medium, and High. When you complete the test, your answers are sent to the model, which returns a probability for each level.' },
      { type: 'h', text: 'How accurate is it?' },
      { type: 'p', text: 'On unseen test data the model achieved around 99% macro F1-score, and its predictions were validated with cross-validation to confirm they are stable.' },
      { type: 'callout', text: 'Important: this is a screening and educational tool, not a medical diagnosis. Always consult a healthcare professional.' },
    ],
  },
]

export const FAQS = [
  {
    q: 'Is this a medical diagnosis?',
    a: 'No. This tool provides an educational risk estimate based on a machine-learning model. It cannot diagnose diabetes. Only a doctor and blood tests can do that.',
  },
  {
    q: 'How is my risk calculated?',
    a: 'Your answers are sent to a trained XGBoost model that has learned patterns from thousands of health records. It returns a probability for Low, Medium, and High risk, and the highest becomes your result.',
  },
  {
    q: 'Is my data stored?',
    a: 'No. Your answers are used only to generate a single prediction and are not saved or shared. Each test is independent.',
  },
  {
    q: 'What is BMI and how do I find mine?',
    a: 'BMI (Body Mass Index) is your weight in kilograms divided by your height in metres squared. Many free online calculators can work it out from your height and weight.',
  },
  {
    q: 'Can Type 2 diabetes be prevented?',
    a: 'Often, yes. Regular activity, a balanced diet, healthy weight, and not smoking can significantly lower the risk of developing Type 2 diabetes or delay its onset.',
  },
  {
    q: 'What should I do if I get a High risk result?',
    a: 'Do not panic — a high result means it is worth speaking to a healthcare professional for a proper blood glucose test and personalised advice. Early action makes a big difference.',
  },
  {
    q: 'How accurate is the model?',
    a: 'On held-out test data it reached roughly 99% macro F1-score, confirmed with cross-validation. However, real-world accuracy depends on data quality and the tool should be used for guidance only.',
  },
]
