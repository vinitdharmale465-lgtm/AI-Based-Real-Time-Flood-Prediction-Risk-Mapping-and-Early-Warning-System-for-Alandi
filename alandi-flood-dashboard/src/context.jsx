
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

import { initialAlerts, initialReports } from './data.js';

const Ctx = createContext(null);

export const useApp = () => useContext(Ctx);

// BACKEND API URL
const API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://alandi-flood-backend.onrender.com'
).replace(/\/+$/, '');

const AUTH_URL = `${API_URL}/api/auth`;

export function AppProvider({ children }) {

  // THEME
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch {
      return 'light';
    }
  });

  // DASHBOARD DATA
  const [alerts, setAlerts] = useState(initialAlerts);
  const [reports, setReports] = useState(initialReports);
  const [toasts, setToasts] = useState([]);

  // AUTHENTICATION
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // THEME EFFECT
  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  // TOAST NOTIFICATION
  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();

    setToasts((t) => [...t, { id, message, type }]);

    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  // CHECK EXISTING LOGIN SESSION
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(`${AUTH_URL}/me`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        setUser(null);
        return null;
      }

      const data = await response.json();

      console.log('Logged-in user:', data.user);

      setUser(data.user);
      return data.user;

    } catch (error) {
      console.error('Authentication Error:', error);
      setUser(null);
      return null;

    } finally {
      setAuthLoading(false);
    }
  }, []);

  // CHECK SESSION WHEN APP STARTS
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // LOGIN
  const login = async (email, password) => {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    console.log('Login user:', data.user);

    setUser(data.user);

    return data;
  };

  // SIGNUP
  const signup = async (name, email, password) => {
    const response = await fetch(`${AUTH_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return data;
  };

  // LOGOUT
  const logout = async () => {
    const response = await fetch(`${AUTH_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }

    setUser(null);

    return data;
  };

  // CONTEXT VALUES
  const value = {
    theme,
    toggleTheme: () =>
      setTheme((t) => (t === 'light' ? 'dark' : 'light')),

    alerts,
    setAlerts,

    reports,
    setReports,

    toast,

    user,
    setUser,
    authLoading,
    checkAuth,
    login,
    signup,
    logout
  };

  return (
    <Ctx.Provider value={value}>
      {children}

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${t.type}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
