import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { RISK } from '../data.js';

export default function MapView({ locations, height = 520 }) {
  return (
    <div className="map-wrap" style={{ height }}>
      <MapContainer center={[18.6763, 73.8985]} zoom={14} zoomControl={false} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomControl position="topright" />
        {locations.map((l) => (
          <CircleMarker key={l.id} center={[l.lat, l.lng]} radius={11} pathOptions={{ color: '#fff', weight: 2, fillColor: RISK[l.risk].color, fillOpacity: 0.95 }}>
            <Popup>
              <strong>{l.name}</strong><br />{l.area}<br />
              Risk: <b style={{ color: RISK[l.risk].color }}>{l.risk}</b><br />
              Water level: {l.level} m<br />Rainfall: {l.rain} mm/h<br />Population nearby: {l.pop.toLocaleString('en-IN')}<br />
              <em>Illustrative demo data</em>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="legend">
        <strong>Risk (demo)</strong>
        {Object.values(RISK).map((r) => <span key={r.label}><i style={{ background: r.color }} />{r.label}</span>)}
      </div>
    </div>
  );
}
