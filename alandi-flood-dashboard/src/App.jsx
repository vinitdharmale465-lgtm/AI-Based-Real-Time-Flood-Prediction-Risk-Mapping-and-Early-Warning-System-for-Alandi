import Weather from './pages/Weather.jsx';
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar, { NAV } from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import Overview from './pages/Overview.jsx';
import Prediction from './pages/Prediction.jsx';
import RiskMap from './pages/RiskMap.jsx';
import Alerts from './pages/Alerts.jsx';
import Analytics from './pages/Analytics.jsx';
import CommunityReports from './pages/CommunityReports.jsx';
import Emergency from './pages/Emergency.jsx';
import Admin from './pages/Admin.jsx';

const PAGES = { '/': Overview, '/weather': Weather, '/prediction': Prediction, '/map': RiskMap, '/alerts': Alerts, '/analytics': Analytics, '/reports': CommunityReports, '/emergency': Emergency, '/admin': Admin };

function Skeleton() {
  return <div className="grid g4">{[1, 2, 3, 4].map((i) => <div key={i} className="card skeleton" />)}</div>;
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const title = (NAV.find((n) => n.to === pathname) || NAV[0]).label;

  useEffect(() => {
    setOpen(false);
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div className="shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main">
        <Navbar title={title} onMenu={() => setOpen(true)} />
        <div className="demo-banner">Demo Data: all values on this dashboard are illustrative and are not real flood warnings.</div>
        <main className="content">
          {loading ? <Skeleton /> : (
            <Routes>
              {Object.entries(PAGES).map(([p, C]) => <Route key={p} path={p} element={<C />} />)}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
}
