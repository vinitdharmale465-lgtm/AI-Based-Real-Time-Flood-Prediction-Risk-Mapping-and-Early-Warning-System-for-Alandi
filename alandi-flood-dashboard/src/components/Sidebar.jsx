import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CloudRain, BrainCircuit, Map, BellRing, BarChart3, Users, LifeBuoy, ShieldCheck, Waves, X } from 'lucide-react';

export const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/weather', label: 'Weather Monitoring', icon: CloudRain },
  { to: '/prediction', label: 'AI Flood Prediction', icon: BrainCircuit },
  { to: '/map', label: 'Flood Risk Map', icon: Map },
  { to: '/alerts', label: 'Early Warning & Alerts', icon: BellRing },
  { to: '/analytics', label: 'Analytics & Reports', icon: BarChart3 },
  { to: '/reports', label: 'Community Reports', icon: Users },
  { to: '/emergency', label: 'Emergency Response', icon: LifeBuoy },
  { to: '/admin', label: 'Admin Dashboard', icon: ShieldCheck },
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand">
        <span className="logo"><Waves size={20} /></span>
        <div><strong>Alandi FloodWatch</strong><small>Demo dashboard</small></div>
        <button className="icon-btn mobile-only" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
      </div>
      <nav>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} /> <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
