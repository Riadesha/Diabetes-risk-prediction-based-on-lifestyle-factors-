export const API_URL = 'http://127.0.0.1:8000'

export async function predictRisk(answers) {
  const res = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...answers,
      age: Number(answers.age),
      bmi: Number(answers.bmi),
    }),
  })
  if (!res.ok) throw new Error(`Server error (${res.status})`)
  return res.json()
}

export async function explainRisk(answers) {
  const res = await fetch(`${API_URL}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...answers,
      age: Number(answers.age),
      bmi: Number(answers.bmi),
    }),
  })
  if (!res.ok) throw new Error(`Server error (${res.status})`)
  return res.json()
}

export async function getFeatureImportance() {
  const res = await fetch(`${API_URL}/feature-importance`)
  if (!res.ok) throw new Error(`Server error (${res.status})`)
  const data = await res.json()
  return data.features || []
}

export const RISK_META = {
  Low: { color: '#0ca30c', icon: '✓', text: 'Low risk of early-stage diabetes.' },
  Medium: { color: '#f59e0b', icon: '!', text: 'Moderate risk — a lifestyle review is advised.' },
  High: { color: '#d03b3b', icon: '⚠', text: 'High risk — clinical follow-up is recommended.' },
}
