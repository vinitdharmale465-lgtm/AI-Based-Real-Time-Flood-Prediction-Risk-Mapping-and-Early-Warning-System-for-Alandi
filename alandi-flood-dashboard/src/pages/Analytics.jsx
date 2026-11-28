
import { Download, CloudRain, Waves, AlertTriangle, TrendingUp } from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import { StatCard, ChartCard, axis, tip } from '../components/ui.jsx';
import { monthly, weekly, distribution, RISK } from '../data.js';
import { useApp } from '../context.jsx';

export default function Analytics() {
  const { toast } = useApp();

  const totalRainfall = monthly.reduce(
    (total, item) => total + Number(item.rain || 0),
    0
  );

  const totalEvents = monthly.reduce(
    (total, item) => total + Number(item.events || 0),
    0
  );

  const peakLevel = monthly.reduce(
    (peak, item) => Math.max(peak, Number(item.level || 0)),
    0
  );

  const wettestMonth = monthly.reduce(
    (wettest, item) =>
      Number(item.rain || 0) > Number(wettest.rain || 0)
        ? item
        : wettest,
    monthly[0] || { m: 'N/A', rain: 0 }
  );

  const exportCsv = () => {
    try {
      const header = ['month', 'rainfall_mm', 'level_m', 'events'];

      const rows = monthly.map((item) => [
        item.m,
        item.rain,
        item.level,
        item.events
      ]);

      const csvContent = [
        header.join(','),
        ...rows.map((row) => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'alandiflood-analytics.csv';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast('Analytics report downloaded.');
    } catch (error) {
      console.error('CSV export error:', error);
      toast('Unable to download analytics report.');
    }
  };

  return (
    <div className="stack">
      {/* Export button */}
      <div className="row between">
        <div className="grow" />

        <button className="btn" onClick={exportCsv}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Statistics */}
      <div className="grid g4">
        <StatCard
          icon={CloudRain}
          label="Season rainfall"
          value={totalRainfall.toFixed(1)}
          unit=" mm"
        />

        <StatCard
          icon={Waves}
          label="Peak water level"
          value={peakLevel.toFixed(1)}
          unit=" m"
          tone="warn"
        />

        <StatCard
          icon={AlertTriangle}
          label="Flood events"
          value={totalEvents}
          tone="crit"
        />

        <StatCard
          icon={TrendingUp}
          label="Wettest month"
          value={wettestMonth?.m || 'N/A'}
          tone="safe"
        />
      </div>

      {/* Charts */}
      <div className="grid g2">
        {/* Monthly rainfall */}
        <ChartCard
          title="Monthly rainfall"
          sub="Rainfall in millimeters"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid
                stroke="var(--line)"
                vertical={false}
              />

              <XAxis dataKey="m" {...axis} />
              <YAxis {...axis} />

              <Tooltip {...tip} />

              <Bar
                dataKey="rain"
                name="Rainfall (mm)"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weekly water level */}
        <ChartCard
          title="Water-level analytics"
          sub="Weekly average (m)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly}>
              <CartesianGrid
                stroke="var(--line)"
                vertical={false}
              />

              <XAxis dataKey="w" {...axis} />
              <YAxis {...axis} />

              <Tooltip {...tip} />

              <Line
                dataKey="level"
                name="Water level (m)"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Flood risk distribution */}
        <ChartCard
          title="Flood-risk distribution"
          sub="Distribution of risk categories"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {distribution.map((item) => (
                  <Cell
                    key={item.name}
                    fill={RISK[item.name]?.color || '#64748B'}
                  />
                ))}
              </Pie>

              <Legend />
              <Tooltip {...tip} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Historical trend */}
        <ChartCard
          title="Historical trend"
          sub="Rainfall vs water level"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly}>
              <CartesianGrid
                stroke="var(--line)"
                vertical={false}
              />

              <XAxis dataKey="m" {...axis} />

              <YAxis
                yAxisId="left"
                {...axis}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                {...axis}
              />

              <Tooltip {...tip} />
              <Legend />

              <Line
                yAxisId="left"
                dataKey="rain"
                name="Rainfall (mm)"
                stroke="#2563EB"
                strokeWidth={2}
                dot={false}
              />

              <Line
                yAxisId="right"
                dataKey="level"
                name="Water level (m)"
                stroke="#DC2626"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
