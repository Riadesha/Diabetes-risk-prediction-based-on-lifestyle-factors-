import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="brand">
            <span className="brand-mark">🩺</span>
            <span className="brand-name">DiabetesRisk<span className="brand-accent">.AI</span></span>
          </div>
          <p className="footer-tag">
            An AI-powered early-stage diabetes risk screening tool.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/test">Risk Test</Link>
          <Link to="/knowledge">Knowledge</Link>
          <Link to="/faq">FAQ</Link>
        </div>
      </div>
      <p className="footer-note">
        For educational and screening purposes only — not a medical diagnosis.
        Always consult a healthcare professional.
      </p>
    </footer>
  )
}
