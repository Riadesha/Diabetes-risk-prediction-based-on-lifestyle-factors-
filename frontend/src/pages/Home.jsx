import { Link } from 'react-router-dom'
import { ARTICLES } from '../data/content'

const STEPS = [
  { n: '1', title: 'Answer questions', text: 'Ten quick questions about health & lifestyle, one at a time.' },
  { n: '2', title: 'AI analysis', text: 'A trained XGBoost model evaluates your answers instantly.' },
  { n: '3', title: 'Get your result', text: 'See your risk level with a clear probability breakdown.' },
]

const HIGHLIGHTS = [
  { icon: '⚡', title: 'Instant', text: 'Results in seconds, powered by machine learning.' },
  { icon: '🔒', title: 'Private', text: 'Your answers are never stored or shared.' },
  { icon: '🎯', title: 'Accurate', text: '~99% F1-score on validation data.' },
]

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <span className="hero-badge">🩺 AI-Powered Health Screening</span>
        <h1>Know your early-stage<br /><span className="grad">diabetes risk</span> in minutes</h1>
        <p className="home-sub">
          Answer a few simple questions and let our machine-learning model estimate
          your risk of early-stage diabetes — completely free and private.
        </p>
        <div className="hero-actions">
          <Link to="/test" className="btn-primary">Start the Risk Test →</Link>
          <Link to="/knowledge" className="btn-ghost">Learn about diabetes</Link>
        </div>

        <div className="highlights">
          {HIGHLIGHTS.map((h) => (
            <div className="highlight" key={h.title}>
              <span className="highlight-icon">{h.icon}</span>
              <div>
                <strong>{h.title}</strong>
                <p>{h.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-steps">
        <h2 className="section-title">How it works</h2>
        <div className="steps-grid">
          {STEPS.map((s) => (
            <div className="step-card" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-knowledge">
        <div className="section-head">
          <h2 className="section-title">Learn about diabetes</h2>
          <Link to="/knowledge" className="see-all">See all →</Link>
        </div>
        <div className="know-grid">
          {ARTICLES.slice(0, 3).map((a) => (
            <Link to={`/knowledge/${a.id}`} className="know-card" key={a.id}>
              <span className="know-icon">{a.icon}</span>
              <span className="know-cat">{a.category}</span>
              <h3>{a.title}</h3>
              <p>{a.summary}</p>
              <span className="know-read">{a.readTime} read →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <h2>Ready to check your risk?</h2>
        <p>It takes less than two minutes.</p>
        <Link to="/test" className="btn-primary">Start the Risk Test →</Link>
      </section>
    </div>
  )
}
