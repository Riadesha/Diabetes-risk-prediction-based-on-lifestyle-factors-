export default function Recommendations({ items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="recs">
      {items.map((r, i) => (
        <div className="rec-card" key={i}>
          <span className="rec-icon">{r.icon}</span>
          <div>
            <h4>{r.title}</h4>
            <p>{r.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
