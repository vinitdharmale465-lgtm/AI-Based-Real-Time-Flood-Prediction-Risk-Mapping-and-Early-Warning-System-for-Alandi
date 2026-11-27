
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Waves, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context.jsx';

export default function Signup() {
  const { signup, toast } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await signup(name, email, password);

      toast('Account created successfully! Please login.');

      navigate('/login');

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
          <h2>Create Account</h2>
          <p>Register to access flood monitoring services</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <div className="auth-input">
            <User size={18} />
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
