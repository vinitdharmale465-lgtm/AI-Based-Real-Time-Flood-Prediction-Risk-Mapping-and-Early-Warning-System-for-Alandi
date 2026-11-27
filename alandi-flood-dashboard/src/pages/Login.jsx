
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Waves, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context.jsx';

export default function Login() {
  const { login, toast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login(email, password);

      toast('Login successful! Welcome back.');

      navigate(
        data.user.role === 'admin' ? '/admin' : '/',
        { replace: true }
      );

    } catch (error) {
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <Waves size={28} />
          </div>
          <h1>Alandi FloodWatch</h1>
          <p>AI-Based Flood Prediction and Early Warning System</p>
        </div>

        <div className="auth-heading">
          <h2>Welcome Back</h2>
          <p>Login to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <div className="auth-input">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="auth-input">
            <Lock size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="auth-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
