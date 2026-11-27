
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  Waves,
  User,
  LogOut
} from 'lucide-react';

import { useApp } from '../context.jsx';

export default function Navbar({ title, onMenu }) {
  const {
    theme,
    toggleTheme,
    alerts,
    toast,
    user,
    logout
  } = useApp();

  const [now, setNow] = useState(new Date());
  const [q, setQ] = useState('');
  const [bell, setBell] = useState(false);
  const [profile, setProfile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const active = alerts.filter((a) => a.status === 'Active');

  const search = (e) => {
    e.preventDefault();

    if (!q.trim()) {
      return toast('Type a location or alert to search.', 'warn');
    }

    nav(`/alerts?q=${encodeURIComponent(q.trim())}`);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logout();

      toast('Logged out successfully.');

      nav('/login', { replace: true });

    } catch (error) {
      toast(error.message || 'Logout failed.', 'error');
    } finally {
      setLoggingOut(false);
      setProfile(false);
    }
  };

  return (
    <header className="navbar">

      <button
        className="icon-btn mobile-only"
        onClick={onMenu}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="nav-title">
        <span className="proj">
          <Waves size={16} /> Alandi FloodWatch
        </span>
        <h1>{title}</h1>
      </div>

      <form className="search" onSubmit={search}>
        <Search size={16} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search alerts or locations"
          aria-label="Search"
        />
      </form>

      <time className="clock">
        {now.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })}
        ,{' '}
        {now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </time>

      {/* NOTIFICATIONS */}
      <div className="pop-wrap">
        <button
          className="icon-btn"
          onClick={() => {
            setBell(!bell);
            setProfile(false);
          }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          {active.length > 0 && (
            <span className="dot">{active.length}</span>
          )}
        </button>

        {bell && (
          <div className="popover">
            <strong>Active demo alerts</strong>

            {active.length === 0 ? (
              <p className="muted">No active alerts.</p>
            ) : (
              active.map((a) => (
                <button
                  key={a.id}
                  className="pop-item"
                  onClick={() => {
                    setBell(false);
                    nav('/alerts');
                  }}
                >
                  <span className={`pill ${a.severity}`}>
                    {a.severity}
                  </span>{' '}
                  {a.title}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* THEME */}
      <button
        className="icon-btn"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
      >
        {theme === 'light'
          ? <Moon size={18} />
          : <Sun size={18} />}
      </button>

      {/* USER PROFILE */}
      <div className="pop-wrap">

        <button
          className="avatar"
          onClick={() => {
            setProfile(!profile);
            setBell(false);
          }}
          aria-label="Profile"
        >
          <User size={16} />
        </button>

        {profile && (
          <div className="popover">

            <strong>{user?.name || 'User'}</strong>

            <p className="muted">
              {user?.email}
            </p>

            <p className="muted">
              Role: {user?.role}
            </p>

            {user?.role === 'admin' && (
              <button
                className="btn ghost"
                onClick={() => {
                  setProfile(false);
                  nav('/admin');
                }}
              >
                Open admin
              </button>
            )}

            <button
              className="btn"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut size={16} />
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>

          </div>
        )}
      </div>

    </header>
  );
}
