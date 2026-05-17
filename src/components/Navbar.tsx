import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, User, LogOut, LogIn, Plus, Menu, X, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.75rem 0',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textDecoration: 'none',
          color: 'white',
          flexShrink: 0
        }}>
          <div style={{
            background: 'var(--accent)',
            padding: '0.4rem',
            borderRadius: '10px',
            display: 'flex'
          }}>
            <Smartphone size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Balozi <span style={{ color: 'var(--accent)' }}>Phones</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              {user.role === 'ROLE_ADMIN' && (
                <>
                  <Link to="/admin/add-phone" className="btn-primary" style={{ padding: '0.5rem 0.9rem', textDecoration: 'none', fontSize: '0.85rem', gap: '0.4rem' }}>
                    <Plus size={15} />
                    Add Phone
                  </Link>
                  <Link to="/admin/profile" className="btn-outline" style={{ padding: '0.5rem 0.9rem', textDecoration: 'none', fontSize: '0.85rem', gap: '0.4rem' }}>
                    <Settings size={15} />
                    Manage
                  </Link>
                </>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem'
                }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </span>
                <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.4rem', borderRadius: '8px', border: 'none' }} title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                <LogIn size={16} />
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', fontSize: '0.85rem' }}>
                Join Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMenuOpen(o => !o)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.4rem', display: 'none' }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="nav-mobile-menu glass" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(15, 23, 42, 0.98)',
          borderBottom: '1px solid var(--border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          zIndex: 99
        }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 600 }}>{user.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</p>
                </div>
              </div>
              {user.role === 'ROLE_ADMIN' && (
                <>
                  <Link to="/admin/add-phone" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                    <Plus size={16} /> Add Phone
                  </Link>
                  <Link to="/admin/profile" onClick={() => setMenuOpen(false)} className="btn-outline" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                    <Settings size={16} /> Manage Profile
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="btn-outline" style={{ border: '1px solid var(--border)', justifyContent: 'center' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '10px', background: 'var(--primary-light)' }}>
                <LogIn size={16} /> Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                Join Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
