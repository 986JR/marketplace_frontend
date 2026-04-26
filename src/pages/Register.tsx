import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../services/api';
import { UserPlus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
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
      setTimeout(() => navigate('/login'), 2000);
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
    <div className="container" style={{ maxWidth: '450px', marginTop: '4rem' }}>
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'var(--accent)',
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <UserPlus color="white" size={30} />
          </div>
          <h2 style={{ fontSize: '2rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join Balozi Phones today</p>
        </div>

        {error && (
          <div className="glass" style={{ 
            padding: '1rem', 
            borderRadius: '12px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <AlertCircle size={20} />
            <p style={{ fontSize: '0.9rem' }}>{error}</p>
          </div>
        )}

        {success && (
          <div className="glass" style={{ 
            padding: '1rem', 
            borderRadius: '12px', 
            background: 'rgba(16, 185, 129, 0.1)', 
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <CheckCircle2 size={20} />
            <p style={{ fontSize: '0.9rem' }}>Account created! Redirecting to login...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Full Name</label>
            <input 
              name="name"
              type="text" 
              required
              value={formData.name}
              onChange={handleChange}
              className="glass"
              placeholder="John Doe"
              style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Email Address</label>
            <input 
              name="email"
              type="email" 
              required
              value={formData.email}
              onChange={handleChange}
              className="glass"
              placeholder="name@example.com"
              style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Password</label>
            <input 
              name="password"
              type="password" 
              required
              value={formData.password}
              onChange={handleChange}
              className="glass"
              placeholder="Min. 6 characters"
              style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Confirm Password</label>
            <input 
              name="confirmPassword"
              type="password" 
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="glass"
              placeholder="Repeat password"
              style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || success}
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
