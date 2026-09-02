import { useState, useEffect, useRef } from 'react'
import { predictRisk, RISK_META } from '../api'

// Only the factors a person can realistically change.
const CONTROLS = [
  { id: 'physical_activity', label: 'Physical Activity', type: 'choice', options: ['Low', 'Moderate', 'High'] },
  { id: 'food_habit', label: 'Food Habit', type: 'choice', options: ['Unhealthy', 'Average', 'Healthy'] },
  { id: 'smoking_habit', label: 'Smoking', type: 'choice', options: ['Current', 'Former', 'Never'] },
  { id: 'blood_pressure', label: 'Blood Pressure', type: 'choice', options: ['High', 'Elevated', 'Normal'] },
  { id: 'bmi', label: 'BMI', type: 'slider', min: 15, max: 50, step: 0.1 },
]

const RANK = { Low: 0, Medium: 1, High: 2 }

export default function WhatIfSimulator({ baseAnswers, baseResult }) {
  const [sim, setSim] = useState(baseAnswers)
  const [simResult, setSimResult] = useState(baseResult)
  const [busy, setBusy] = useState(false)
  const timer = useRef(null)

  // Re-predict (debounced) whenever a control changes.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      setBusy(true)
      try {
        setSimResult(await predictRisk(sim))
      } catch {
        /* keep last result on error */
      } finally {
        setBusy(false)
      }
    }, 250)
    return () => clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim])

  const set = (id, value) => setSim((s) => ({ ...s, [id]: value }))
  const reset = () => setSim(baseAnswers)

  const meta = RISK_META[simResult.prediction]
  const baseRank = RANK[baseResult.prediction]
  const simRank = RANK[simResult.prediction]
  const changed = JSON.stringify(sim) !== JSON.stringify(baseAnswers)

  let delta = null
  if (changed) {
    if (simRank < baseRank) delta = { text: `Improved from ${baseResult.prediction} → ${simResult.prediction}`, cls: 'good' }
    else if (simRank > baseRank) delta = { text: `Worsened from ${baseResult.prediction} → ${simResult.prediction}`, cls: 'bad' }
    else delta = { text: `Still ${simResult.prediction} risk`, cls: 'same' }
  }

  return (
    <div className="whatif">
      <div className="whatif-head">
        <h3 className="bars-title" style={{ margin: 0 }}>What-if simulator</h3>
        {changed && (
          <button className="whatif-reset" onClick={reset}>↺ Reset</button>
        )}
      </div>
      <p className="whatif-sub">
        Adjust the factors you can change and see how your risk responds — instantly.
      </p>

      <div className={`whatif-result ${busy ? 'busy' : ''}`} style={{ '--risk': meta.color }}>
        <div className="whatif-badge">{simResult.prediction} Risk</div>
        <div className="whatif-prob">
          {(simResult.probabilities[simResult.prediction] * 100).toFixed(0)}% likely
        </div>
        {delta && <div className={`whatif-delta ${delta.cls}`}>{delta.text}</div>}
      </div>

      <div className="whatif-controls">
        {CONTROLS.map((c) => (
          <div className="whatif-field" key={c.id}>
            <label>
              {c.label}
              {c.type === 'slider' && <span className="val"> {Number(sim[c.id]).toFixed(1)}</span>}
            </label>
            {c.type === 'choice' ? (
              <div className="whatif-seg">
                {c.options.map((o) => (
                  <button
                    key={o}
                    className={sim[c.id] === o ? 'wseg active' : 'wseg'}
                    onClick={() => set(c.id, o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="range" min={c.min} max={c.max} step={c.step}
                value={sim[c.id]}
                onChange={(e) => set(c.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
