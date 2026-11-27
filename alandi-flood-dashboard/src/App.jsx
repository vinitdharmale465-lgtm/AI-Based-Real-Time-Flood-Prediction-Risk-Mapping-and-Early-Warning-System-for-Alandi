
import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import Sidebar, { NAV } from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';

import Overview from './pages/Overview.jsx';
import Weather from './pages/Weather.jsx';
import Prediction from './pages/Prediction.jsx';
import RiskMap from './pages/RiskMap.jsx';
import Alerts from './pages/Alerts.jsx';
import Analytics from './pages/Analytics.jsx';
import CommunityReports from './pages/CommunityReports.jsx';
import Emergency from './pages/Emergency.jsx';
import Admin from './pages/Admin.jsx';

import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

import { useApp } from './context.jsx';

// All dashboard pages
const PAGES = {
  '/': Overview,
  '/weather': Weather,
  '/prediction': Prediction,
  '/map': RiskMap,
  '/alerts': Alerts,
  '/analytics': Analytics,
  '/reports': CommunityReports,
  '/emergency': Emergency,
  '/admin': Admin
};

// Loading skeleton
function Skeleton() {
  return (
    <div className="grid g4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card skeleton" />
      ))}
    </div>
  );
}

// Dashboard layout
function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { pathname } = useLocation();

  // Select page based on URL
  const Page = PAGES[pathname] || Overview;

  // Page title
  const currentPage = NAV.find(
    (item) => item.to === pathname
  );

  const title = currentPage
    ? currentPage.label
    : 'Dashboard';

  // Loading animation when changing pages
  useEffect(() => {
    setOpen(false);
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="shell">

      {/* Sidebar */}
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      {/* Mobile sidebar background */}
      {open && (
        <div
          className="scrim"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="main">

        {/* Navbar */}
        <Navbar
          title={title}
          onMenu={() => setOpen(true)}
        />

        {/* Page content */}
        <main className="content">
          {loading ? (
            <Skeleton />
          ) : (
            <Page />
          )}
        </main>

      </div>
    </div>
  );
}

// Main application
export default function App() {
  const {
    user,
    authLoading
  } = useApp();

  const location = useLocation();

  // Authentication loading
  if (authLoading) {
    return <Skeleton />;
  }

  return (
    <Routes>

      {/* Login page */}
      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/" replace />
            : <Login />
        }
      />

      {/* Signup page */}
      <Route
        path="/signup"
        element={
          user
            ? <Navigate to="/" replace />
            : <Signup />
        }
      />

      {/* Admin page */}
      <Route
        path="/admin"
        element={
          !user
            ? <Navigate to="/login" replace />
            : user.role !== 'admin'
              ? <Navigate to="/" replace />
              : <DashboardLayout />
        }
      />

      {/* Other dashboard pages */}
      <Route
        path="/*"
        element={
          user
            ? <DashboardLayout />
            : (
              <Navigate
                to="/login"
                state={{ from: location }}
                replace
              />
            )
        }
      />

    </Routes>
  );
}
