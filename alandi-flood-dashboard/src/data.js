// ALL DATA BELOW IS ILLUSTRATIVE DEMO DATA. It is not real-time and not an official warning.
export const RISK = {
  Low: { color: '#16A34A', label: 'Low' },
  Moderate: { color: '#EAB308', label: 'Moderate' },
  High: { color: '#F97316', label: 'High' },
  Critical: { color: '#DC2626', label: 'Critical' },
};
const hrs = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const rain = [0.2,0.0,0.4,0.8,1.2,2.5,3.1,4.8,6.2,8.4,9.1,7.6,6.8,5.2,4.4,3.9,5.5,7.2,8.8,6.1,4.2,2.8,1.6,0.9];
const level = [2.1,2.1,2.2,2.2,2.3,2.5,2.7,3.0,3.4,3.9,4.4,4.8,5.1,5.3,5.4,5.5,5.8,6.2,6.7,6.9,6.9,6.8,6.6,6.4];
export const hourly = hrs.map((t, i) => ({ t, rain: rain[i], level: level[i], danger: 7.5 }));
export const monthly = ['Jun','Jul','Aug','Sep','Oct','Nov'].map((m, i) => ({
  m, rain: [182, 410, 365, 240, 95, 22][i], level: [3.2, 5.9, 5.4, 4.1, 2.8, 2.2][i], events: [0, 3, 2, 1, 0, 0][i],
}));
export const weekly = Array.from({ length: 8 }, (_, i) => ({ w: `W${i + 1}`, rain: [40,95,130,88,150,70,45,60][i], level: [2.8,3.6,4.9,4.2,5.8,4.1,3.3,3.9][i] }));
export const distribution = [
  { name: 'Low', value: 9 }, { name: 'Moderate', value: 5 }, { name: 'High', value: 3 }, { name: 'Critical', value: 1 },
];
export const weather = { temp: 26, humidity: 87, rain: 6.9, wind: 18, condition: 'Heavy rain', pressure: 1004, visibility: 4.2, cloud: 92 };
export const locations = [
  { id: 1, name: 'Indrayani Ghat', area: 'Alandi', lat: 18.6779, lng: 73.8991, risk: 'Critical', level: 6.9, rain: 8.8, pop: 4200 },
  { id: 2, name: 'Alandi Bridge', area: 'Alandi', lat: 18.6742, lng: 73.9012, risk: 'High', level: 6.4, rain: 7.1, pop: 3100 },
  { id: 3, name: 'Dnyaneshwar Temple Area', area: 'Alandi', lat: 18.6763, lng: 73.8985, risk: 'High', level: 5.8, rain: 6.5, pop: 6800 },
  { id: 4, name: 'Markal Road', area: 'Markal', lat: 18.6685, lng: 73.9120, risk: 'Moderate', level: 4.9, rain: 5.2, pop: 2400 },
  { id: 5, name: 'Chakan Road Junction', area: 'Alandi', lat: 18.6820, lng: 73.8890, risk: 'Moderate', level: 4.3, rain: 4.9, pop: 5200 },
  { id: 6, name: 'Dehu Phata', area: 'Dehu Road', lat: 18.6900, lng: 73.9150, risk: 'Low', level: 3.1, rain: 3.2, pop: 1800 },
  { id: 7, name: 'Kelgaon', area: 'Kelgaon', lat: 18.6590, lng: 73.8900, risk: 'Low', level: 2.8, rain: 2.9, pop: 1500 },
  { id: 8, name: 'Charholi Budruk', area: 'Charholi', lat: 18.6610, lng: 73.9200, risk: 'Moderate', level: 4.5, rain: 5.0, pop: 3600 },
];
export const initialAlerts = [
  { id: 1, severity: 'Critical', title: 'Indrayani water level near danger mark', desc: 'Demo scenario: river level is rising quickly near the ghat.', location: 'Indrayani Ghat', time: '2026-11-11 13:10', status: 'Active', advice: ['Stay away from the riverbank', 'Move valuables to higher floors', 'Keep your phone charged'] },
  { id: 2, severity: 'High', title: 'Low-lying road waterlogging expected', desc: 'Demo scenario: heavy rain may cover the approach to Alandi Bridge.', location: 'Alandi Bridge', time: '2026-11-11 12:40', status: 'Active', advice: ['Avoid driving through flooded roads', 'Use alternate routes'] },
  { id: 3, severity: 'High', title: 'Crowd safety near temple area', desc: 'Demo scenario: runoff may reach low-lying lanes near the temple.', location: 'Dnyaneshwar Temple Area', time: '2026-11-11 11:55', status: 'Acknowledged', advice: ['Follow instructions from volunteers', 'Keep children and elders away from water'] },
  { id: 4, severity: 'Moderate', title: 'Rising drain levels', desc: 'Demo scenario: drains near Markal Road are filling.', location: 'Markal Road', time: '2026-11-11 10:20', status: 'Active', advice: ['Clear drain covers of debris if safe', 'Monitor updates'] },
  { id: 5, severity: 'Low', title: 'Light waterlogging reported', desc: 'Demo scenario: minor ponding in open areas.', location: 'Kelgaon', time: '2026-11-10 18:05', status: 'Resolved', advice: ['No action needed; stay informed'] },
];
export const initialReports = [
  { id: 101, location: 'Alandi Bridge', category: 'Waterlogging', desc: 'Water over the road surface near the bridge approach.', date: '2026-11-11', status: 'Pending' },
  { id: 102, location: 'Markal Road', category: 'Blocked drain', desc: 'Drain clogged with plastic waste.', date: '2026-11-10', status: 'Verified' },
  { id: 103, location: 'Kelgaon', category: 'Road damage', desc: 'Pothole filled with water, hard to see.', date: '2026-11-09', status: 'Resolved' },
];
export const predictions = {
  '1h': { risk: 62, cat: 'High', conf: 88, trend: [6.9, 7.0, 7.1], note: 'Rainfall intensity is still high and the river level is close to its demo danger mark.' },
  '3h': { risk: 74, cat: 'High', conf: 82, trend: [6.9, 7.2, 7.4], note: 'Upstream inflow is assumed to keep the level rising for a few hours.' },
  '6h': { risk: 85, cat: 'Critical', conf: 74, trend: [6.9, 7.6, 7.9], note: 'Accumulated rainfall may push the river past the demo danger mark.' },
  '24h': { risk: 48, cat: 'Moderate', conf: 61, trend: [6.9, 6.0, 4.8], note: 'Rain is expected to ease, so the level should fall, with less certainty.' },
};
export const categoryFor = (p) => (p >= 80 ? 'Critical' : p >= 60 ? 'High' : p >= 35 ? 'Moderate' : 'Low');
