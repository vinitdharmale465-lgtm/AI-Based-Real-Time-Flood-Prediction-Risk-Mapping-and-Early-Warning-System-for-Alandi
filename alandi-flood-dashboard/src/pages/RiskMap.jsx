import { useState } from 'react';
import MapView from '../components/MapView.jsx';
import { Pill, DemoTag } from '../components/ui.jsx';
import { locations, RISK } from '../data.js';

export default function RiskMap() {
  const [f, setF] = useState('All');
  const shown = f === 'All' ? locations : locations.filter((l) => l.risk === f);
  return (
    <div className="stack">
      <div className="note">Marker positions and risk levels are illustrative demo data,not surveyed flood zones.</div>
      <div className="chips">
        {['All', ...Object.keys(RISK)].map((x) => <button key={x} className={`chip ${f === x ? 'on' : ''}`} onClick={() => setF(x)}>{x}</button>)}
        <DemoTag text="Illustrative Data" />
      </div>
      <MapView locations={shown} height={520} />
      <section className="card"><div className="card-head"><h3>Locations shown ({shown.length})</h3></div>
        <ul className="list">{shown.map((l) => <li key={l.id}><Pill level={l.risk} /> {l.name} <small className="muted sm">{l.level} m</small></li>)}</ul>
      </section>
    </div>
  );
}
