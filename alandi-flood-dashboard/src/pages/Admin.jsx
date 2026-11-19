import { useState } from 'react';
import { MapPin, FileText, BellRing, Activity, Trash2, Plus } from 'lucide-react';
import { StatCard, Pill, Empty } from '../components/ui.jsx';
import { locations } from '../data.js';
import { useApp } from '../context.jsx';

export default function Admin() {
  const { alerts, setAlerts, reports, toast } = useApp();
  const [q, setQ] = useState('');
  const [title, setTitle] = useState('');
  const [sev, setSev] = useState('Moderate');
  const locs = locations.filter((l) => l.name.toLowerCase().includes(q.toLowerCase()));
  const add = (e) => {
    e.preventDefault();
    if (title.trim().length < 5) return toast('Alert title needs at least 5 characters.', 'error');
    setAlerts([{ id: Date.now(), severity: sev, title: title.trim(), desc: 'Demo alert created from the admin panel.', location: 'Alandi', time: new Date().toISOString().slice(0, 16).replace('T', ' '), status: 'Active', advice: ['Demo only: no action needed'] }, ...alerts]);
    setTitle('');
    toast('Demo alert created.');
  };
  const del = (id) => { setAlerts(alerts.filter((a) => a.id !== id)); toast('Demo alert deleted.'); };
  return (
    <div className="stack">
      <div className="grid g4">
        <StatCard icon={MapPin} label="Monitoring locations" value={locations.length} />
        <StatCard icon={FileText} label="Total reports" value={reports.length} />
        <StatCard icon={BellRing} label="Active alerts" value={alerts.filter((a) => a.status === 'Active').length} tone="crit" />
        <StatCard icon={Activity} label="High or critical sites" value={locations.filter((l) => ['High', 'Critical'].includes(l.risk)).length} tone="warn" />
      </div>
      <section className="card"><h3>Demo alert management</h3>
        <form className="row wrap" onSubmit={add}>
          <input className="grow" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New demo alert title" aria-label="Alert title" />
          <select value={sev} onChange={(e) => setSev(e.target.value)}>{['Low', 'Moderate', 'High', 'Critical'].map((s) => <option key={s}>{s}</option>)}</select>
          <button className="btn" type="submit"><Plus size={16} /> Create alert</button>
        </form>
        {alerts.length === 0 ? <Empty text="No alerts. Create one above." /> : <div className="table-wrap"><table><thead><tr><th>Title</th><th>Severity</th><th>Status</th><th /></tr></thead>
          <tbody>{alerts.map((a) => <tr key={a.id}><td>{a.title}</td><td><Pill level={a.severity} /></td><td><span className={`status ${a.status}`}>{a.status}</span></td><td><button className="icon-btn" onClick={() => del(a.id)} aria-label={`Delete ${a.title}`}><Trash2 size={16} /></button></td></tr>)}</tbody></table></div>}
      </section>
      <section className="card"><div className="card-head"><h3>Monitoring locations</h3><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search locations" aria-label="Search locations" /></div>
        {locs.length === 0 ? <Empty /> : <div className="table-wrap"><table><thead><tr><th>Name</th><th>Area</th><th>Level (m)</th><th>Risk</th></tr></thead>
          <tbody>{locs.map((l) => <tr key={l.id}><td>{l.name}</td><td>{l.area}</td><td>{l.level}</td><td><Pill level={l.risk} /></td></tr>)}</tbody></table></div>}
      </section>
    </div>
  );
}
