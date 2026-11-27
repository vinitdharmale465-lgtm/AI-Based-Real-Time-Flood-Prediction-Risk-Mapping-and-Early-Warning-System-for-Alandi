
import { useEffect, useState } from 'react';
import {
  Info,
  Gauge,
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  RefreshCw
} from 'lucide-react';

export default function Prediction() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPrediction = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'http://127.0.0.1:5000/api/flood/predict'
      );

      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          `API returned HTML or invalid JSON. Status: ${response.status}. Check backend URL and route.`
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message || 'Unable to fetch prediction'
        );
      }

      setData(result);

    } catch (err) {
      setError(err.message || 'Backend connection failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();

    const interval = setInterval(fetchPrediction, 300000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk) => {
    if (risk === 'High') return '#dc2626';
    if (risk === 'Medium') return '#d97706';
    return '#16a34a';
  };

  if (loading && !data) {
    return (
      <div className="card">
        <h3>Loading Flood Prediction...</h3>
        <p className="muted">
          Fetching live weather information for Alandi.
        </p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="card">
        <h3>Prediction Error</h3>
        <p className="err">{error}</p>

        <button className="btn" onClick={fetchPrediction}>
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const riskColor = getRiskColor(data.risk);

  return (
    <div className="stack">

      <div className="note">
        Live weather-based flood risk assessment for Alandi.
        This is an initial rule-based model, not a validated flood warning.
      </div>

      <div className="row">
        <h2>Flood Risk Prediction</h2>

        <button
          className="btn"
          onClick={fetchPrediction}
          disabled={loading}
        >
          <RefreshCw size={15} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Current Flood Risk - {data.location}</h3>

          <span
            style={{
              background: riskColor,
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: '600'
            }}
          >
            {data.risk} Risk
          </span>
        </div>

        <div className="big" style={{ color: riskColor }}>
          {data.score}/100
        </div>

        <p className="muted">Flood Risk Score</p>

        <div className="bar">
          <i
            style={{
              width: `${data.score}%`,
              background: riskColor
            }}
          />
        </div>

        <p>
          <Info size={15} /> {data.reason}
        </p>
      </div>

      <div className="grid g3">

        <div className="card">
          <div className="card-head">
            <h3><CloudRain size={17} /> Expected Rainfall</h3>
          </div>
          <div className="big">{data.rainfall} mm</div>
          <p className="muted sm">Forecast daily rainfall</p>
        </div>

        <div className="card">
          <div className="card-head">
            <h3><Droplets size={17} /> Rain Probability</h3>
          </div>
          <div className="big">{data.rainChance}%</div>
          <p className="muted sm">Chance of rain today</p>
        </div>

        <div className="card">
          <div className="card-head">
            <h3><Thermometer size={17} /> Temperature</h3>
          </div>
          <div className="big">{data.temperature} °C</div>
          <p className="muted sm">Current temperature</p>
        </div>

        <div className="card">
          <div className="card-head">
            <h3><Droplets size={17} /> Humidity</h3>
          </div>
          <div className="big">{data.humidity}%</div>
          <p className="muted sm">Current humidity</p>
        </div>

        <div className="card">
          <div className="card-head">
            <h3><CloudRain size={17} /> Current Rainfall</h3>
          </div>
          <div className="big">{data.currentRainfall} mm</div>
          <p className="muted sm">Current precipitation</p>
        </div>

        <div className="card">
          <div className="card-head">
            <h3><Wind size={17} /> Wind Speed</h3>
          </div>
          <div className="big">{data.windSpeed} km/h</div>
          <p className="muted sm">Current wind speed</p>
        </div>

      </div>

      <div className="card">
        <div className="card-head">
          <h3><Gauge size={17} /> Why this prediction?</h3>
        </div>

        <p>
          The system currently calculates flood risk using rainfall,
          rain probability and current weather conditions.
        </p>

        <ul className="bullets">
          <li>Expected rainfall: {data.rainfall} mm</li>
          <li>Rain probability: {data.rainChance}%</li>
          <li>Current rainfall: {data.currentRainfall} mm</li>
          <li>Humidity: {data.humidity}%</li>
          <li>Weather condition: {data.condition}</li>
        </ul>

        <p className="muted sm">
          Last updated: {data.updatedAt}
        </p>

        <p className="muted sm">
          Risk score is a rule-based demonstration score,
          not a statistically calibrated probability of flooding.
          River level and water-level sensor data are not yet included.
        </p>
      </div>

    </div>
  );
}
