import { useParams, Link } from 'react-router-dom'
import { ARTICLES } from '../data/content'

function Block({ block }) {
  switch (block.type) {
    case 'h':
      return <h2 className="art-h">{block.text}</h2>
    case 'p':
      return <p className="art-p">{block.text}</p>
    case 'ul':
      return (
        <ul className="art-ul">
          {block.items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      )
    case 'callout':
      return <div className="art-callout">💡 {block.text}</div>
    default:
      return null
  }
}

export default function Article() {
  const { id } = useParams()
  const article = ARTICLES.find((a) => a.id === id)

  if (!article) {
    return (
      <div className="page-wrap">
        <div className="not-found">
          <h1>Article not found</h1>
          <Link to="/knowledge" className="btn-primary">Back to Knowledge Hub</Link>
        </div>
      </div>
    )
  }

  const related = ARTICLES.filter((a) => a.id !== article.id).slice(0, 3)

  return (
    <div className="page-wrap article">
      <Link to="/knowledge" className="back-link">← All articles</Link>

      <header className="art-head">
        <span className="art-emoji">{article.icon}</span>
        <span className="know-cat">{article.category} · {article.readTime} read</span>
        <h1>{article.title}</h1>
        <p className="art-summary">{article.summary}</p>
      </header>

      <article className="art-body">
        {article.body.map((b, i) => <Block block={b} key={i} />)}
      </article>

      <div className="art-cta">
        <h3>Curious about your own risk?</h3>
        <Link to="/test" className="btn-primary">Take the Risk Test →</Link>
      </div>

      <section className="art-related">
        <h3>Keep reading</h3>
        <div className="know-grid">
          {related.map((a) => (
            <Link to={`/knowledge/${a.id}`} className="know-card" key={a.id}>
              <span className="know-icon">{a.icon}</span>
              <span className="know-cat">{a.category}</span>
              <h3>{a.title}</h3>
              <p>{a.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
