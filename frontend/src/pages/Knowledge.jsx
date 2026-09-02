import { Link } from 'react-router-dom'
import { ARTICLES } from '../data/content'

export default function Knowledge() {
  return (
    <div className="page-wrap">
      <header className="page-head">
        <span className="hero-badge">📚 Knowledge Hub</span>
        <h1>Understanding Diabetes</h1>
        <p>
          Clear, practical articles on diabetes types, symptoms, prevention, and
          healthy living — to help you make informed decisions.
        </p>
      </header>

      <div className="know-grid full">
        {ARTICLES.map((a) => (
          <Link to={`/knowledge/${a.id}`} className="know-card" key={a.id}>
            <span className="know-icon">{a.icon}</span>
            <span className="know-cat">{a.category}</span>
            <h3>{a.title}</h3>
            <p>{a.summary}</p>
            <span className="know-read">{a.readTime} read →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
