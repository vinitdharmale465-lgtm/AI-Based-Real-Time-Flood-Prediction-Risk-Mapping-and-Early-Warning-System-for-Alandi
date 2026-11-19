import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Moon, Sun, Waves, User } from 'lucide-react';
import { useApp } from '../context.jsx';

export default function Navbar({ title, onMenu }) {
  const { theme, toggleTheme, alerts, toast } = useApp();
  const [now, setNow] = useState(new Date());
  const [q, setQ] = useState('');
  const [bell, setBell] = useState(false);
  const [profile, setProfile] = useState(false);
  const nav = useNavigate();
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  const active = alerts.filter((a) => a.status === 'Active');

  const search = (e) => {
    e.preventDefault();
    if (!q.trim()) return toast('Type a location or alert to search.', 'warn');
    nav(`/alerts?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="navbar">
      <button className="icon-btn mobile-only" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <div className="nav-title"><span className="proj"><Waves size={16} /> Alandi FloodWatch</span><h1>{title}</h1></div>
      <form className="search" onSubmit={search}>
        <Search size={16} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search alerts or locations" aria-label="Search" />
      </form>
      <time className="clock">{now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</time>
      <div className="pop-wrap">
        <button className="icon-btn" onClick={() => { setBell(!bell); setProfile(false); }} aria-label="Notifications">
          <Bell size={18} />{active.length > 0 && <span className="dot">{active.length}</span>}
        </button>
        {bell && (
          <div className="popover">
            <strong>Active demo alerts</strong>
            {active.length === 0 ? <p className="muted">No active alerts.</p> : active.map((a) => (
              <button key={a.id} className="pop-item" onClick={() => { setBell(false); nav('/alerts'); }}>
                <span className={`pill ${a.severity}`}>{a.severity}</span> {a.title}
              </button>
            ))}
          </div>
        )}
      </div>
      <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
      <div className="pop-wrap">
        <button className="avatar" onClick={() => { setProfile(!profile); setBell(false); }} aria-label="Profile"><User size={16} /></button>
        {profile && (
          <div className="popover">
            <strong>Demo Admin</strong><p className="muted">admin@example.com (placeholder)</p>
            <button className="btn ghost" onClick={() => { setProfile(false); nav('/admin'); }}>Open admin</button>
          </div>
        )}
      </div>
    </header>
  );
}
