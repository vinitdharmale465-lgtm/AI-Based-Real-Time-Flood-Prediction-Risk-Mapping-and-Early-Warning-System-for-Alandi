import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import AlertCard from '../components/AlertCard.jsx';
import { Empty } from '../components/ui.jsx';
import { useApp } from '../context.jsx';

export default function Alerts() {
  const { alerts, setAlerts, toast } = useApp();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [sev, setSev] = useState('All');
  const list = alerts.filter((a) => (sev === 'All' || a.severity === sev) && `${a.title} ${a.location} ${a.desc}`.toLowerCase().includes(q.toLowerCase()));
  const set = (id, status) => { setAlerts((as) => as.map((a) => (a.id === id ? { ...a, status } : a))); toast(`Alert ${status.toLowerCase()}.`); };
  return (
    <div className="stack">
      <div className="note">These are demo alerts for design purposes. They are not real warnings.</div>
      <div className="toolbar">
        <label className="field-inline"><Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search alerts or locations" /></label>
        <div className="chips">{['All', 'Critical', 'High', 'Moderate', 'Low'].map((s) => <button key={s} className={`chip ${sev === s ? 'on' : ''}`} onClick={() => setSev(s)}>{s}</button>)}</div>
      </div>
      {list.length === 0 ? <Empty text="No alerts match. Try another severity or search term." /> : <div className="grid g2">{list.map((a) => <AlertCard key={a.id} alert={a} onAck={(id) => set(id, 'Acknowledged')} onResolve={(id) => set(id, 'Resolved')} />)}</div>}
    </div>
  );
}
