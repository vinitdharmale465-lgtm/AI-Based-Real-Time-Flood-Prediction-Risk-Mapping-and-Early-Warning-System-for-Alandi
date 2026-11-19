
import { useEffect, useState } from 'react';

import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Gauge,
  Eye,
  Cloud,
  Sun
} from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

import {
  StatCard,
  ChartCard,
  axis,
  tip
} from '../components/ui.jsx';

import {
  getHourlyRainfall,
  getDailyRainfall
} from '../services/api.js';

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState('');

  const [loading, setLoading] = useState(true);
  const [forecastLoading, setForecastLoading] = useState(true);
  const [historicalLoading, setHistoricalLoading] = useState(true);

  const [error, setError] = useState('');
  const [forecastError, setForecastError] = useState('');
  const [historicalError, setHistoricalError] = useState('');

  // Current weather API
  const fetchWeather = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/weather/current'
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Weather fetch failed');
      }

      setWeatherData(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Weather forecast API
  const fetchForecast = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/weather/forecast'
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Forecast fetch failed');
      }

      setForecastData(data.forecast || []);
      setForecastError('');
    } catch (err) {
      setForecastError(err.message);
    } finally {
      setForecastLoading(false);
    }
  };

  // Historical hourly and daily rainfall APIs
  const fetchHistoricalRainfall = async () => {
    try {
      const [hourly, daily] = await Promise.all([
        getHourlyRainfall(),
        getDailyRainfall()
      ]);

      setHourlyData(hourly.hourly || []);
      setDailyData(daily.daily || []);

      setHistoricalError('');
    } catch (err) {
      setHistoricalError(err.message);
    } finally {
      setHistoricalLoading(false);
    }
  };

  // Machine Learning flood risk prediction API
  const fetchMlPrediction = async () => {
    if (!weatherData) return;

    try {
      setMlLoading(true);
      setMlError('');

      const w = weatherData;

      const inputData = {
        temperature_2m_c: Number(w.temperature ?? 0),

        relative_humidity_2m_percent: Number(w.humidity ?? 0),

        precipitation_mm: Number(
          w.precipitation ?? w.rainfall ?? 0
        ),

        rain_mm: Number(w.rain ?? w.rainfall ?? 0),

        // Temporary fallback.
        // Replace with actual sensor/API soil moisture.
        soil_moisture_0_to_7cm: Number(
          w.soilMoisture ?? 0.35
        ),

        // Replace these fallbacks with actual rainfall totals.
        rainfall_3h: Number(w.rainfall3h ?? 0),
        rainfall_6h: Number(w.rainfall6h ?? 0),
        rainfall_24h: Number(w.rainfall24h ?? 0)
      };

      const response = await fetch(
        'http://localhost:5000/api/predict-risk',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(inputData)
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'ML prediction failed'
        );
      }

      setMlPrediction(result.predicted_risk);

    } catch (err) {
      setMlError(err.message);
      setMlPrediction(null);
    } finally {
      setMlLoading(false);
    }
  };

  // Load all data
  useEffect(() => {
    fetchWeather();
    fetchForecast();
    fetchHistoricalRainfall();

    const interval = setInterval(() => {
      fetchWeather();
      fetchForecast();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Run ML prediction whenever current weather changes
  useEffect(() => {
    if (weatherData) {
      fetchMlPrediction();
    }
  }, [weatherData]);

  const w = weatherData;

  // Forecast chart data
  const chartData = forecastData.map((item) => {
    const date = new Date(
      String(item.time).replace(' ', 'T')
    );

    return {
      time: isNaN(date.getTime())
        ? item.time
        : date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }),
      rainfall: item.rainfall,
      probability: item.rainProbability
    };
  });

  // Historical hourly chart data
  const hourlyChartData = [...hourlyData]
    .reverse()
    .map((item) => ({
      time: item.timeIst || item.timestamp,
      rainfall: item.rain
    }));

  // Historical daily chart data
  const dailyChartData = [...dailyData]
    .reverse()
    .map((item) => ({
      date: item.dateIst || item.date,
      rainfall: item.rainSum
    }));

  // ML risk color
  const getRiskColor = (risk) => {
    const value = String(risk || '').toLowerCase();

    if (value.includes('severe')) return '#DC2626';
    if (value.includes('high')) return '#EA580C';
    if (value.includes('moderate')) return '#D97706';
    if (value.includes('low')) return '#16A34A';

    return '#64748B';
  };

  return (
    <div className="stack">

      {/* Loading and errors */}
      {loading && (
        <p className="muted">
          Loading current weather...
        </p>
      )}

      {error && (
        <p className="err">
          Weather Error: {error}
        </p>
      )}

      {/* Current weather cards */}
      <div className="grid g4">

        <StatCard
          icon={Thermometer}
          label="Temperature"
          value={w ? Number(w.temperature).toFixed(1) : '--'}
          unit="°C"
          tone="warn"
        />

        <StatCard
          icon={Droplets}
          label="Humidity"
          value={w ? w.humidity : '--'}
          unit="%"
        />

        <StatCard
          icon={CloudRain}
          label="Rainfall"
          value={
            w && w.rainfall != null
              ? w.rainfall
              : '--'
          }
          unit=" mm"
        />

        <StatCard
          icon={Wind}
          label="Wind Speed"
          value={
            w
              ? (w.windSpeed * 3.6).toFixed(1)
              : '--'
          }
          unit=" km/h"
          tone="safe"
        />

      </div>

      {/* ML Flood Risk Prediction */}
      <section className="card">

        <div className="card-head">
          <h3>AI Flood Risk Prediction</h3>
        </div>

        {mlLoading && (
          <p className="muted">
            Machine Learning model is predicting flood risk...
          </p>
        )}

        {mlError && (
          <p className="err">
            Prediction Error: {mlError}
          </p>
        )}

        {!mlLoading && !mlError && mlPrediction && (
          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'var(--surface)',
              border: '1px solid var(--line)'
            }}
          >

            <p className="muted">
              Predicted Flood Risk Level
            </p>

            <h2
              style={{
                color: getRiskColor(mlPrediction),
                fontSize: '32px',
                margin: '10px 0'
              }}
            >
              {String(mlPrediction).toUpperCase()}
            </h2>

            <p className="muted sm">
              Prediction generated using the Random Forest
              Machine Learning model.
            </p>

          </div>
        )}

        <p className="muted sm">
          Prototype prediction only. Some input values currently
          use temporary fallback values. This is not an official
          flood warning.
        </p>

        <button
          className="btn"
          onClick={fetchMlPrediction}
          disabled={mlLoading || !weatherData}
        >
          {mlLoading ? 'Predicting...' : 'Refresh ML Prediction'}
        </button>

      </section>

      {/* Additional weather information */}
      <div className="grid g3">

        <StatCard
          icon={Sun}
          label="Conditions"
          value={w ? w.condition : '--'}
          hint="WeatherAPI data"
        />

        <StatCard
          icon={Gauge}
          label="Pressure"
          value={w ? w.pressure : '--'}
          unit=" hPa"
        />

        <StatCard
          icon={Eye}
          label="Visibility"
          value={
            w && w.visibility != null
              ? (w.visibility / 1000).toFixed(1)
              : '--'
          }
          unit=" km"
        />

      </div>

      {/* Rainfall forecast chart */}
      <ChartCard
        title="Rainfall Forecast"
        sub="Next 24 hours | 3-hour intervals | Alandi"
        height={300}
      >

        {forecastLoading && (
          <p className="muted">
            Loading forecast...
          </p>
        )}

        {forecastError && (
          <p className="err">{forecastError}</p>
        )}

        {!forecastLoading &&
          !forecastError &&
          chartData.some(item => item.rainfall != null) && (

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>

                <CartesianGrid
                  stroke="var(--line)"
                  vertical={false}
                />

                <XAxis
                  dataKey="time"
                  {...axis}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={65}
                />

                <YAxis {...axis} unit=" mm" />

                <Tooltip {...tip} />

                <Bar
                  dataKey="rainfall"
                  name="Rainfall (mm)"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          )}

        {!forecastLoading &&
          !forecastError &&
          (chartData.length === 0 ||
            chartData.every(item => item.rainfall == null)) && (
            <p className="muted">
              Rainfall data is unavailable for these intervals.
            </p>
          )}

      </ChartCard>

      {/* Rain probability chart */}
      <ChartCard
        title="Rain Probability Forecast"
        sub="Probability of precipitation | Next 24 hours"
        height={300}
      >

        {forecastLoading && (
          <p className="muted">
            Loading rain probability...
          </p>
        )}

        {forecastError && (
          <p className="err">{forecastError}</p>
        )}

        {!forecastLoading &&
          !forecastError &&
          chartData.some(item => item.probability != null) && (

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>

                <CartesianGrid
                  stroke="var(--line)"
                  vertical={false}
                />

                <XAxis
                  dataKey="time"
                  {...axis}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={65}
                />

                <YAxis
                  {...axis}
                  domain={[0, 100]}
                  unit="%"
                />

                <Tooltip {...tip} />

                <Bar
                  dataKey="probability"
                  name="Rain Probability"
                  fill="#0D9488"
                  radius={[4, 4, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          )}

        {!forecastLoading &&
          !forecastError &&
          (chartData.length === 0 ||
            chartData.every(item => item.probability == null)) && (
            <p className="muted">
              Rain probability data is unavailable.
            </p>
          )}

      </ChartCard>

      {/* Historical hourly rainfall chart */}
      <ChartCard
        title="Historical Hourly Rainfall"
        sub="MongoDB historical dataset | Alandi"
        height={350}
      >

        {historicalLoading && (
          <p className="muted">
            Loading hourly rainfall data...
          </p>
        )}

        {historicalError && (
          <p className="err">{historicalError}</p>
        )}

        {!historicalLoading &&
          !historicalError &&
          hourlyChartData.length > 0 && (

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyChartData}>

                <CartesianGrid
                  stroke="var(--line)"
                  vertical={false}
                />

                <XAxis
                  dataKey="time"
                  {...axis}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />

                <YAxis {...axis} unit=" mm" />

                <Tooltip {...tip} />

                <Bar
                  dataKey="rainfall"
                  name="Hourly Rainfall"
                  fill="#0891B2"
                  radius={[3, 3, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          )}

        {!historicalLoading &&
          !historicalError &&
          hourlyChartData.length === 0 && (
            <p className="muted">
              No hourly rainfall records found.
            </p>
          )}

      </ChartCard>

      {/* Historical daily rainfall chart */}
      <ChartCard
        title="Historical Daily Rainfall"
        sub="Daily rainfall records from MongoDB | Alandi"
        height={350}
      >

        {historicalLoading && (
          <p className="muted">
            Loading daily rainfall data...
          </p>
        )}

        {historicalError && (
          <p className="err">{historicalError}</p>
        )}

        {!historicalLoading &&
          !historicalError &&
          dailyChartData.length > 0 && (

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyChartData}>

                <CartesianGrid
                  stroke="var(--line)"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  {...axis}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />

                <YAxis {...axis} unit=" mm" />

                <Tooltip {...tip} />

                <Bar
                  dataKey="rainfall"
                  name="Daily Rainfall"
                  fill="#7C3AED"
                  radius={[3, 3, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          )}

        {!historicalLoading &&
          !historicalError &&
          dailyChartData.length === 0 && (
            <p className="muted">
              No daily rainfall records found.
            </p>
          )}

      </ChartCard>

      {/* Forecast details */}
      <section className="card">

        <div className="card-head">
          <h3>Rainfall Forecast Details</h3>
        </div>

        {forecastLoading && (
          <p className="muted">
            Loading forecast details...
          </p>
        )}

        {forecastError && (
          <p className="err">{forecastError}</p>
        )}

        {!forecastLoading &&
          !forecastError &&
          forecastData.map((item, index) => (

            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 0',
                borderBottom: '1px solid var(--line)'
              }}
            >

              <div>
                <b>{item.time}</b>

                <p className="muted sm">
                  {item.condition || 'Weather forecast'}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>

                <b>
                  {item.rainfall != null
                    ? `${item.rainfall} mm`
                    : 'Rainfall unavailable'}
                </b>

                <p className="muted sm">
                  Temperature: {item.temperature ?? '--'} °C
                </p>

                <p className="muted sm">
                  Rain probability:{' '}
                  {item.rainProbability != null
                    ? `${Number(item.rainProbability).toFixed(0)}%`
                    : 'Unavailable'}
                </p>

              </div>

            </div>

          ))}

        <p className="muted sm">
          Rainfall represents accumulated precipitation
          over each 3-hour interval. Rain probability is
          a separate forecast measurement.
        </p>

      </section>

      {/* Weather statistics */}
      <section className="card">

        <div className="card-head">
          <h3>Weather Statistics</h3>
        </div>

        <div className="grid g3 plain">

          <p>
            <Cloud size={16} />
            Cloud Cover:
            <b>{w ? ` ${w.clouds}%` : ' --'}</b>
          </p>

          <p>
            <CloudRain size={16} />
            Rainfall:
            <b>
              {w && w.rainfall != null
                ? ` ${w.rainfall} mm`
                : ' Unavailable'}
            </b>
          </p>

          <p>
            <Wind size={16} />
            Wind Direction:
            <b>
              {w && w.windDirection != null
                ? ` ${w.windDirection}°`
                : ' --'}
            </b>
          </p>

        </div>

        {w && w.lastUpdated && (
          <p className="muted sm">
            Last provider update:{' '}
            {new Date(w.lastUpdated * 1000).toLocaleString()}
          </p>
        )}

      </section>

    </div>
  );
}
