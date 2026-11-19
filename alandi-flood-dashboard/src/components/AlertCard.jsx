import { MapPin, Clock } from 'lucide-react';
import { Pill } from './ui.jsx';

export default function AlertCard({ alert, onAck, onResolve }) {
  return (
    <article className={`card alert ${alert.severity}`}>
      <div className="alert-top"><Pill level={alert.severity} /><span className={`status ${alert.status}`}>{alert.status}</span></div>
      <h3>{alert.title}</h3>
      <p>{alert.desc}</p>
      <p className="muted sm"><MapPin size={13} /> {alert.location} &nbsp; <Clock size={13} /> {alert.time}</p>
      <details><summary>Recommended safety instructions</summary><ul>{alert.advice.map((a) => <li key={a}>{a}</li>)}</ul></details>
      {(onAck || onResolve) && alert.status !== 'Resolved' && (
        <div className="row">
          {onAck && alert.status === 'Active' && <button className="btn ghost" onClick={() => onAck(alert.id)}>Acknowledge</button>}
          {onResolve && <button className="btn" onClick={() => onResolve(alert.id)}>Mark resolved</button>}
        </div>
      )}
    </article>
  );
}
