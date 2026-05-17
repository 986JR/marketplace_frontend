import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../services/api';
import { UserPlus, Loader2, AlertCircle, CheckCircle2, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      await registerApi({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="auth-page">
      <div className="container auth-shell">
        <div className="glass auth-card auth-card-compact">
          <div className="auth-header">
            <div className="auth-icon">
              <UserPlus color="white" size={28} />
            </div>
            <h2>Create Account</h2>
            <p>Join Balozi Phones and start exploring trusted devices.</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="auth-alert auth-alert-success">
              <CheckCircle2 size={18} />
              <p>Account created. Redirecting to login...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form auth-form-tight">
            <label className="auth-label">Full Name</label>
            <div className="auth-input-wrap glass">
              <User size={16} />
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrap glass">
              <Mail size={16} />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />
            </div>

            <label className="auth-label">Password</label>
            <div className="auth-input-wrap glass">
              <Lock size={16} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
              />
              <button type="button" className="auth-eye" onClick={() => setShowPassword(v => !v)} aria-label="Toggle password visibility">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label className="auth-label">Confirm Password</label>
            <div className="auth-input-wrap glass">
              <Lock size={16} />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
              />
              <button type="button" className="auth-eye" onClick={() => setShowConfirmPassword(v => !v)} aria-label="Toggle confirm password visibility">
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="btn-primary auth-submit"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Register'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
