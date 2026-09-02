import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/test', label: 'Risk Test' },
  { to: '/knowledge', label: 'Knowledge' },
  { to: '/faq', label: 'FAQ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">🩺</span>
          <span className="brand-name">DiabetesRisk<span className="brand-accent">.AI</span></span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '✕' : '☰'}
        </button>

        <div className={open ? 'nav-links open' : 'nav-links'}>
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/test" className="nav-cta" onClick={() => setOpen(false)}>
            Start Test
          </Link>
        </div>
      </div>
    </nav>
  )
}
