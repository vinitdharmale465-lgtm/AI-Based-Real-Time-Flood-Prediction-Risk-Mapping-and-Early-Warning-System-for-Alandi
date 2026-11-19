import { Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { StatCard, ChartCard, axis, tip } from '../components/ui.jsx';
import { CloudRain, Waves, AlertTriangle, TrendingUp } from 'lucide-react';
import { monthly, weekly, distribution, RISK } from '../data.js';
import { useApp } from '../context.jsx';

export default function Analytics() {
  const { toast } = useApp();
  const exportCsv = () => {
    const rows = ['month,rainfall_mm,level_m,events', ...monthly.map((m) => `${m.m},${m.rain},${m.level},${m.events}`)].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }));
    a.download = 'demo-analytics.csv';
    a.click();
    toast('Demo report downloaded.');
  };
  return (
    <div className="stack">
      <div className="row between"><div className="note grow">All charts use illustrative demo data.</div><button className="btn" onClick={exportCsv}><Download size={16} /> Export demo CSV</button></div>
      <div className="grid g4">
        <StatCard icon={CloudRain} label="Season rainfall" value={monthly.reduce((s, m) => s + m.rain, 0)} unit=" mm" />
        <StatCard icon={Waves} label="Peak level" value="5.9" unit=" m" tone="warn" />
        <StatCard icon={AlertTriangle} label="Flood events" value={monthly.reduce((s, m) => s + m.events, 0)} tone="crit" />
        <StatCard icon={TrendingUp} label="Wettest month" value="Jul" tone="safe" />
      </div>
      <div className="grid g2">
        <ChartCard title="Monthly rainfall" sub="mm"><ResponsiveContainer><BarChart data={monthly}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="m" {...axis} /><YAxis {...axis} /><Tooltip {...tip} /><Bar dataKey="rain" fill="#2563EB" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Water-level analytics" sub="Weekly average (m)"><ResponsiveContainer><LineChart data={weekly}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="w" {...axis} /><YAxis {...axis} /><Tooltip {...tip} /><Line dataKey="level" stroke="#F59E0B" strokeWidth={2} /></LineChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Flood-risk distribution"><ResponsiveContainer><PieChart><Pie data={distribution} dataKey="value" nameKey="name" outerRadius={90} label>{distribution.map((d) => <Cell key={d.name} fill={RISK[d.name].color} />)}</Pie><Legend /><Tooltip {...tip} /></PieChart></ResponsiveContainer></ChartCard>
        <ChartCard title="Historical trend" sub="Rainfall vs level"><ResponsiveContainer><LineChart data={monthly}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="m" {...axis} /><YAxis yAxisId="l" {...axis} /><YAxis yAxisId="r" orientation="right" {...axis} /><Tooltip {...tip} /><Legend /><Line yAxisId="l" dataKey="rain" name="Rain (mm)" stroke="#2563EB" strokeWidth={2} /><Line yAxisId="r" dataKey="level" name="Level (m)" stroke="#DC2626" strokeWidth={2} /></LineChart></ResponsiveContainer></ChartCard>
      </div>
    </div>
  );
}
