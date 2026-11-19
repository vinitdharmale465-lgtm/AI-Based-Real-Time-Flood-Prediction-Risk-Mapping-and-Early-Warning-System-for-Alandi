import { useState } from 'react';
import { Phone, CheckCircle2, ShieldAlert, Lightbulb } from 'lucide-react';

const CHECK = ['Keep an emergency kit with water, torch and first aid', 'Charge phones and power banks', 'Keep ID papers in a waterproof bag', 'Know your nearest safe high ground', 'Switch off electricity at the mains if water enters', 'Help children, elders and neighbours first'];
const GUIDE = ['Never walk or drive through flowing water', 'Move to higher floors or ground early', 'Avoid riverbanks and bridges during heavy rain', 'Follow instructions from local authorities', 'Do not touch fallen electric wires'];
const TIPS = ['Store drinking water in sealed containers', 'Clear drains near your home when safe', 'Share updates only from trusted sources'];

export default function Emergency() {
  const [done, setDone] = useState([]);
  const toggle = (i) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  return (
    <div className="stack">
      <div className="note">Contact numbers below are placeholders. Replace them with verified local emergency numbers before real use.</div>
      <div className="grid g2">
        <section className="card"><div className="card-head"><h3><CheckCircle2 size={18} /> Evacuation checklist</h3><span className="muted sm">{done.length}/{CHECK.length} done</span></div>
          <div className="bar"><i style={{ width: `${(done.length / CHECK.length) * 100}%` }} /></div>
          <ul className="checks">{CHECK.map((c, i) => <li key={c}><label><input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} /> {c}</label></li>)}</ul>
        </section>
        <section className="card"><h3><ShieldAlert size={18} /> Flood safety guidelines</h3><ul className="bullets">{GUIDE.map((g) => <li key={g}>{g}</li>)}</ul></section>
      </div>
      <div className="grid g2">
        <section className="card"><h3><Phone size={18} /> Emergency contacts (placeholders)</h3>
          <ul className="list">{['Emergency control room', 'Local disaster management office', 'Nearest hospital', 'Local police station'].map((n) => <li key={n}>{n}<b className="push">[Add number]</b></li>)}</ul></section>
        <section className="card"><h3><Lightbulb size={18} /> Safety tips and precautions</h3><ul className="bullets">{TIPS.map((t) => <li key={t}>{t}</li>)}</ul></section>
      </div>
    </div>
  );
}
