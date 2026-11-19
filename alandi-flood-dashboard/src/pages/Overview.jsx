import { MapPin, CloudRain, Waves, ShieldAlert, BellRing, Thermometer } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { StatCard, ChartCard, Pill, axis, tip } from '../components/ui.jsx';
import { hourly, distribution, locations, weather, RISK } from '../data.js';
import { useApp } from '../context.jsx';

export default function Overview() {
  const { alerts } = useApp();
  const active = alerts.filter((a) => a.status === 'Active');
  return (
    <div className="stack">
      <div className="grid g3">
        <StatCard icon={MapPin} label="Monitored locations" value={locations.length} hint="Demo sites around Alandi" />
        <StatCard icon={CloudRain} label="Current rainfall" value={weather.rain} unit=" mm/h" tone="primary" hint="Illustrative value" />
        <StatCard icon={Waves} label="River water level" value="6.9" unit=" m" tone="warn" hint="Demo danger mark: 7.5 m" />
        <StatCard icon={ShieldAlert} label="Current flood risk" value="High" tone="crit" hint="Demo scenario" />
        <StatCard icon={BellRing} label="Active alerts" value={active.length} tone="crit" hint="Demo alerts only" />
        <StatCard icon={Thermometer} label="Weather" value={weather.condition} hint={`${weather.temp}°C, ${weather.humidity}% humidity`} tone="safe" />
      </div>
      <div className="grid g2">
        <ChartCard title="Rainfall trend" sub="Last 24 hours (mm/h)">
          <ResponsiveContainer><AreaChart data={hourly}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="t" {...axis} interval={3} /><YAxis {...axis} /><Tooltip {...tip} /><Area dataKey="rain" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} /></AreaChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Water-level trend" sub="Last 24 hours (m)">
          <ResponsiveContainer><LineChart data={hourly}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="t" {...axis} interval={3} /><YAxis {...axis} domain={[0, 9]} /><Tooltip {...tip} /><ReferenceLine y={7.5} stroke="#DC2626" strokeDasharray="4 4" label={{ value: 'Demo danger', fill: '#DC2626', fontSize: 11 }} /><Line dataKey="level" stroke="#0B1220" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="grid g2">
        <ChartCard title="Flood risk distribution" sub="Locations by risk level">
          <ResponsiveContainer><PieChart><Pie data={distribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2} label>{distribution.map((d) => <Cell key={d.name} fill={RISK[d.name].color} />)}</Pie><Tooltip {...tip} /></PieChart></ResponsiveContainer>
        </ChartCard>
        <section className="card">
          <div className="card-head"><h3>Recent alerts</h3></div>
          <ul className="list">{alerts.slice(0, 4).map((a) => <li key={a.id}><Pill level={a.severity} /> <span>{a.title}<small className="muted sm block">{a.location}, {a.time}</small></span></li>)}</ul>
        </section>
      </div>
      <section className="card">
        <div className="card-head"><h3>Monitoring location summary</h3></div>
        <div className="table-wrap"><table><thead><tr><th>Location</th><th>Area</th><th>Level (m)</th><th>Rain (mm/h)</th><th>Risk</th></tr></thead>
          <tbody>{locations.map((l) => <tr key={l.id}><td>{l.name}</td><td>{l.area}</td><td>{l.level}</td><td>{l.rain}</td><td><Pill level={l.risk} /></td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
}
