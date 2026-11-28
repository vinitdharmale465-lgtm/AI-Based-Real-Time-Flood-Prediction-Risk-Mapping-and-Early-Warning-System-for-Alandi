import { Inbox } from 'lucide-react';

export const DemoTag = ({ text = 'Demo Data' }) => <span className="demo-tag">{text}</span>;
export const Pill = ({ level, children }) => <span className={`pill ${level}`}>{children || level}</span>;

export function StatCard({ icon: Icon, label, value, unit, hint, tone = 'primary' }) {
  return (
    <div className="card stat">
      <span className={`stat-icon ${tone}`}><Icon size={20} /></span>
      <div><p className="muted">{label}</p><p className="stat-val">{value}<small>{unit}</small></p>{hint && <p className="muted sm">{hint}</p>}</div>
    </div>
  );
}

export function ChartCard({
  title,
  sub,
  children,
  height = 260,
  className = ''
}) {
  return (
    <section className={`card ${className}`}>
      <div className="card-head">
        <div>
          <h3>{title}</h3>
          {sub && <p className="muted sm">{sub}</p>}
        </div>
      </div>

      <div style={{ height, width: '100%' }}>
        {children}
      </div>
    </section>
  );
}

export function Empty({ text = 'Nothing matches your filters.' }) {
  return <div className="empty"><Inbox size={28} /><p>{text}</p></div>;
}

export const axis = { tick: { fill: 'var(--muted)', fontSize: 12 }, stroke: 'var(--line)' };
export const tip = { contentStyle: { background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 8, color: 'var(--text)' } };
