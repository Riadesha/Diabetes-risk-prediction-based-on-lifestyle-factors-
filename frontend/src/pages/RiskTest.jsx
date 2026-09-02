import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QUESTIONS, INITIAL_ANSWERS } from '../data/questions'
import { predictRisk, explainRisk, RISK_META } from '../api'
import ExplanationBars from '../components/ExplanationBars'
import Recommendations from '../components/Recommendations'
import WhatIfSimulator from '../components/WhatIfSimulator'

const RISK_ORDER = ['Low', 'Medium', 'High']

export default function RiskTest() {
  const [phase, setPhase] = useState('intro') // intro | quiz | loading | result
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [result, setResult] = useState(null)
  const [explanation, setExplanation] = useState(null)
  const [submitted, setSubmitted] = useState(INITIAL_ANSWERS)
  const [error, setError] = useState(null)

  const total = QUESTIONS.length
  const q = QUESTIONS[step]

  const setAnswer = (id, value) => setAnswers((a) => ({ ...a, [id]: value }))

  async function submit(finalAnswers) {
    setPhase('loading')
    setError(null)
    try {
      const [res, expl] = await Promise.all([
        predictRisk(finalAnswers),
        explainRisk(finalAnswers),
      ])
      setResult(res)
      setExplanation(expl)
      setSubmitted(finalAnswers)
      setPhase('result')
    } catch (err) {
      setError(
        String(err).includes('fetch') || String(err).includes('Failed')
          ? 'Cannot reach the backend. Make sure the FastAPI server is running on port 8000.'
          : String(err),
      )
      setPhase('quiz')
    }
  }

  function advance(updated) {
    if (step < total - 1) {
      setStep((s) => s + 1)
    } else {
      submit(updated)
    }
  }

  // Choice/boolean: select then auto-advance.
  function choose(value) {
    const updated = { ...answers, [q.id]: value }
    setAnswers(updated)
    setTimeout(() => advance(updated), 180)
  }

  function restart() {
    setAnswers(INITIAL_ANSWERS)
    setStep(0)
    setResult(null)
    setExplanation(null)
    setError(null)
    setPhase('intro')
  }

  /* ----------------------- Intro ----------------------- */
  if (phase === 'intro') {
    return (
      <div className="quiz-wrap">
        <div className="quiz-intro">
          <span className="quiz-emoji">🩺</span>
          <h1>Early-Stage Diabetes Risk Test</h1>
          <p>
            Answer {total} short questions about health and lifestyle. It takes
            under two minutes, and your answers are never stored.
          </p>
          <button className="btn-primary" onClick={() => setPhase('quiz')}>
            Begin →
          </button>
          {error && <p className="quiz-error">{error}</p>}
        </div>
      </div>
    )
  }

  /* ----------------------- Loading ----------------------- */
  if (phase === 'loading') {
    return (
      <div className="quiz-wrap">
        <div className="quiz-loading">
          <div className="spinner" />
          <p>Analyzing your answers…</p>
        </div>
      </div>
    )
  }

  /* ----------------------- Result ----------------------- */
  if (phase === 'result' && result) {
    const meta = RISK_META[result.prediction]
    return (
      <div className="quiz-wrap">
        <div className="result-page">
          <div className="verdict" style={{ '--risk': meta.color }}>
            <div className="verdict-icon">{meta.icon}</div>
            <div>
              <div className="verdict-label">{result.prediction} Risk</div>
              <div className="verdict-conf">
                {(result.confidence * 100).toFixed(1)}% confidence
              </div>
            </div>
          </div>
          <p className="verdict-text">{meta.text}</p>

          <h3 className="bars-title">Probability by risk level</h3>
          <div className="bars">
            {RISK_ORDER.map((cls) => {
              const p = result.probabilities[cls] ?? 0
              return (
                <div className="bar-row" key={cls}>
                  <span className="bar-label">{cls}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${Math.max(p * 100, 1.5)}%`, background: RISK_META[cls].color }} />
                  </div>
                  <span className="bar-pct">{(p * 100).toFixed(1)}%</span>
                </div>
              )
            })}
          </div>

          {explanation && (
            <>
              <h3 className="bars-title">Why this result?</h3>
              <p className="section-note">
                How each factor pushed your risk up or down (SHAP analysis).
              </p>
              <ExplanationBars contributions={explanation.contributions} />
            </>
          )}

          <WhatIfSimulator baseAnswers={submitted} baseResult={result} />

          {explanation && explanation.recommendations && (
            <>
              <h3 className="bars-title">Your personalized plan</h3>
              <Recommendations items={explanation.recommendations} />
            </>
          )}

          <div className="result-actions">
            <button className="btn-ghost" onClick={restart}>↺ Retake test</button>
            <Link className="btn-primary" to="/knowledge">Learn how to lower risk →</Link>
          </div>
          <p className="disclaimer">For educational purposes only — not a medical diagnosis.</p>
        </div>
      </div>
    )
  }

  /* ----------------------- Quiz ----------------------- */
  const progress = ((step + 1) / total) * 100
  return (
    <div className="quiz-wrap">
      <div className="quiz-top">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-label">Question {step + 1} of {total}</span>
      </div>

      <div className="quiz-card" key={q.id}>
        <h2 className="quiz-q">{q.title}</h2>
        {q.help && <p className="quiz-help">{q.help}</p>}

        {q.type === 'choice' && (
          <div className="choice-grid">
            {q.options.map((o) => (
              <button
                key={o.value}
                className={answers[q.id] === o.value ? 'choice active' : 'choice'}
                onClick={() => choose(o.value)}
              >
                <span className="choice-icon">{o.icon}</span>
                <span className="choice-label">{o.label}</span>
              </button>
            ))}
          </div>
        )}

        {q.type === 'boolean' && (
          <div className="choice-grid two">
            {[
              { value: 'Yes', icon: '✅' },
              { value: 'No', icon: '❌' },
            ].map((o) => (
              <button
                key={o.value}
                className={answers[q.id] === o.value ? 'choice active' : 'choice'}
                onClick={() => choose(o.value)}
              >
                <span className="choice-icon">{o.icon}</span>
                <span className="choice-label">{o.value}</span>
              </button>
            ))}
          </div>
        )}

        {q.type === 'slider' && (
          <div className="slider-block">
            <div className="slider-value">
              {Number(answers[q.id]).toFixed(q.decimals || 0)}
              <span className="slider-unit">{q.unit}</span>
            </div>
            <input
              type="range"
              min={q.min} max={q.max} step={q.step}
              value={answers[q.id]}
              onChange={(e) => setAnswer(q.id, e.target.value)}
            />
            <div className="slider-ends">
              <span>{q.min}</span><span>{q.max}</span>
            </div>
            <button className="btn-primary wide" onClick={() => advance(answers)}>
              {step < total - 1 ? 'Next →' : 'See my result →'}
            </button>
          </div>
        )}
      </div>

      <div className="quiz-nav">
        <button
          className="nav-back"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          ← Back
        </button>
        {error && <span className="quiz-error">{error}</span>}
      </div>
    </div>
  )
}
