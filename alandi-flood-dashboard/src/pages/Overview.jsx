
import { useEffect, useState } from 'react';
import {
  MapPin,
  CloudRain,
  Waves,
  ShieldAlert,
  BellRing,
  Thermometer
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';

import {
  StatCard,
  ChartCard,
  Pill,
  axis,
  tip
} from '../components/ui.jsx';

import {
  hourly,
  distribution,
  locations,
  RISK
} from '../data.js';

import { useApp } from '../context.jsx';

export default function Overview() {
  const { alerts } = useApp();

  const [floodData, setFloodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFloodData = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/flood/predict'
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to fetch flood data');
        }

        setFloodData(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFloodData();

    const interval = setInterval(fetchFloodData, 300000);

    return () => clearInterval(interval);
  }, []);

  const active = alerts.filter((a) => a.status === 'Active');

  const riskTone =
    floodData?.risk === 'High'
      ? 'crit'
      : floodData?.risk === 'Medium'
      ? 'warn'
      : 'success';

  return (
    <div className="stack">

      {error && (
        <div className="card">
          <p>Live weather data unavailable: {error}</p>
          <p className="muted sm">
            Check that your backend and WeatherAPI connection are running.
          </p>
        </div>
      )}

      <div className="grid g3">

        <StatCard
          icon={MapPin}
          label="Monitored locations"
          value={locations.length}
          hint="Demo monitoring locations"
        />

        <StatCard
          icon={CloudRain}
          label="Current rainfall"
          value={
            loading
              ? 'Loading...'
              : floodData
              ? floodData.currentRainfall
              : 'Unavailable'
          }
          unit={floodData ? ' mm' : ''}
          tone="primary"
          hint="Live WeatherAPI precipitation"
        />

        <StatCard
          icon={Waves}
          label="River water level"
          value="6.9"
          unit=" m"
          tone="warn"
          hint="Demo value - not a live river measurement"
        />

        <StatCard
          icon={ShieldAlert}
          label="Current flood risk"
          value={
            loading
              ? 'Loading...'
              : floodData
              ? floodData.risk
              : 'Unavailable'
          }
          tone={floodData ? riskTone : 'safe'}
          hint={
            floodData
              ? `Weather-based risk score: ${floodData.score}/100`
              : 'Waiting for live data'
          }
        />

        <StatCard
          icon={BellRing}
          label="Active alerts"
          value={active.length}
          tone="crit"
          hint="Demo alerts only"
        />

        <StatCard
          icon={Thermometer}
          label="Temperature"
          value={
            loading
              ? 'Loading...'
              : floodData
              ? `${floodData.temperature}°C`
              : 'Unavailable'
          }
          hint={
            floodData
              ? `${floodData.humidity}% humidity`
              : 'Live weather data'
          }
          tone="safe"
        />

      </div>

      {floodData && (
        <section className="card">
          <div className="card-head">
            <h3>Live Weather-Based Flood Assessment</h3>
          </div>

          <p>
            <strong>Risk:</strong> {floodData.risk}
          </p>

          <p>
            <strong>Reason:</strong> {floodData.reason}
          </p>

          <p>
            <strong>Daily rainfall forecast:</strong> {floodData.rainfall} mm
          </p>

          <p>
            <strong>Chance of rain:</strong> {floodData.rainChance}%
          </p>

          <p className="muted sm">
            Last updated: {floodData.updatedAt}
          </p>

          <p className="muted sm">
            This is a weather-based estimate, not an official flood warning.
          </p>
        </section>
      )}

      <div className="grid g2">

        <ChartCard title="Rainfall trend" sub="Last 24 hours ">
          <ResponsiveContainer>
            <AreaChart data={hourly}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="t" {...axis} interval={3} />
              <YAxis {...axis} />
              <Tooltip {...tip} />
              <Area
                dataKey="rain"
                stroke="#2563EB"
                fill="#2563EB"
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Water-level trend" sub="Last 24 hours ">
          <ResponsiveContainer>
            <LineChart data={hourly}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="t" {...axis} interval={3} />
              <YAxis {...axis} domain={[0, 9]} />
              <Tooltip {...tip} />

              <ReferenceLine
                y={7.5}
                stroke="#DC2626"
                strokeDasharray="4 4"
                label={{
                  value: 'Demo danger',
                  fill: '#DC2626',
                  fontSize: 11
                }}
              />

              <Line
                dataKey="level"
                stroke="#0B1220"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      <div className="grid g2">

        <ChartCard
          title="Flood risk distribution"
          sub="Demo locations by risk level"
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={distribution}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                label
              >
                {distribution.map((d) => (
                  <Cell
                    key={d.name}
                    fill={RISK[d.name].color}
                  />
                ))}
              </Pie>
              <Tooltip {...tip} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <section className="card">
          <div className="card-head">
            <h3>Recent alerts</h3>
          </div>

          <ul className="list">
            {alerts.slice(0, 4).map((a) => (
              <li key={a.id}>
                <Pill level={a.severity} />
                <span>
                  {a.title}
                  <small className="muted sm block">
                    {a.location}, {a.time}
                  </small>
                </span>
              </li>
            ))}
          </ul>
        </section>

      </div>

      <section className="card">
        <div className="card-head">
          <h3>Monitoring location summary</h3>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Area</th>
                <th>Level (m)</th>
                <th>Rain (mm/h)</th>
                <th>Risk</th>
              </tr>
            </thead>

            <tbody>
              {locations.map((l) => (
                <tr key={l.id}>
                  <td>{l.name}</td>
                  <td>{l.area}</td>
                  <td>{l.level}</td>
                  <td>{l.rain}</td>
                  <td>
                    <Pill level={l.risk} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="muted sm">
          Location-level readings are illustrative.
        </p>
      </section>

    </div>
  );
}
