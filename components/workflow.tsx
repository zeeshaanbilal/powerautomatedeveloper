export function Workflow() {
  return (
    <div
      className="workflow"
      role="img"
      aria-label="Example workflow: a request triggers validation, a team approval, and an update to business systems."
    >
      <div className="workflow-top">
        <span className="workflow-dot" /> A better way to work
        <span className="workflow-tag">CONNECTED</span>
      </div>
      <div className="workflow-canvas">
        <div className="flow-line" />
        <div className="flow-node node-one">
          <div className="node-icon blue">↯</div>
          <div>
            <small>01 · TRIGGER</small>
            <strong>A request comes in</strong>
            <span>Forms, email or your business app</span>
          </div>
          <i>✓</i>
        </div>
        <div className="flow-node node-two">
          <div className="node-icon purple">◇</div>
          <div>
            <small>02 · VALIDATE</small>
            <strong>The right data. In place.</strong>
            <span>Check, enrich and route</span>
          </div>
          <i>✓</i>
        </div>
        <div className="flow-node node-three">
          <div className="node-icon teal">✓</div>
          <div>
            <small>03 · APPROVE</small>
            <strong>Your team stays in control</strong>
            <span>Human review where it matters</span>
          </div>
          <i>✓</i>
        </div>
        <div className="flow-node node-four">
          <div className="node-icon navy">⇄</div>
          <div>
            <small>04 · CONNECT</small>
            <strong>Business moves forward</strong>
            <span>Update systems. Notify people.</span>
          </div>
          <i>✓</i>
        </div>
      </div>
      <div className="workflow-bottom">
        <span>POWER AUTOMATE + YOUR SYSTEMS</span>
        <span>Built around your process ↗</span>
      </div>
    </div>
  );
}
