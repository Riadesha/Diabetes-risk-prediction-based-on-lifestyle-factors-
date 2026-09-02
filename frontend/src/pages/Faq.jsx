import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FAQS } from '../data/content'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <div className="page-wrap">
      <header className="page-head">
        <span className="hero-badge">❓ Frequently Asked</span>
        <h1>Questions & Answers</h1>
        <p>Everything you might want to know about this tool and diabetes risk.</p>
      </header>

      <div className="faq-list">
        {FAQS.map((f, i) => {
          const isOpen = open === i
          return (
            <div className={isOpen ? 'faq-item open' : 'faq-item'} key={i}>
              <button className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)}>
                <span>{f.q}</span>
                <span className="faq-chevron">{isOpen ? '−' : '+'}</span>
              </button>
              <div className="faq-a" style={{ maxHeight: isOpen ? '300px' : '0' }}>
                <p>{f.a}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="faq-cta">
        <p>Still have questions? The best next step is a quick check.</p>
        <Link to="/test" className="btn-primary">Take the Risk Test →</Link>
      </div>
    </div>
  )
}
