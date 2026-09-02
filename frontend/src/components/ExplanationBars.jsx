const INCREASE = '#d03b3b' // raises risk
const DECREASE = '#0ca30c' // lowers risk

export default function ExplanationBars({ contributions }) {
  if (!contributions || contributions.length === 0) return null
  const maxAbs = Math.max(...contributions.map((c) => Math.abs(c.value))) || 1

  return (
    <div className="shap">
      <div className="shap-legend">
        <span><span className="dot" style={{ background: DECREASE }} /> Lowers risk</span>
        <span>Raises risk <span className="dot" style={{ background: INCREASE }} /></span>
      </div>

      <div className="shap-bars">
        {contributions.map((c) => {
          const half = (Math.abs(c.value) / maxAbs) * 50
          const up = c.direction === 'increase'
          const style = up
            ? { left: '50%', width: `${half}%`, background: INCREASE }
            : { left: `${50 - half}%`, width: `${half}%`, background: DECREASE }
          return (
            <div className="shap-row" key={c.feature}>
              <span className="shap-label">{c.feature}</span>
              <div className="shap-track">
                <div className="shap-center" />
                <div className="shap-fill" style={style} />
              </div>
              <span className="shap-val" style={{ color: up ? INCREASE : DECREASE }}>
                {up ? '+' : '−'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
