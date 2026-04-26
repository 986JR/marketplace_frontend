import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone } from '../services/api';
import { ExternalLink, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { deletePhone } from '../services/api';
import EditPhoneModal from './EditPhoneModal';

interface PhoneCardProps {
  phone: Phone;
  onDelete?: (id: number) => void;
}

const PhoneCard: React.FC<PhoneCardProps> = ({ phone, onDelete }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deleting) return; // prevent spam
    if (!window.confirm(`Delete "${phone.model}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deletePhone(phone.id);
      if (onDelete) onDelete(phone.id);
    } catch (err: any) {
      console.error('Delete failed:', err?.response?.data || err.message);
      alert('Failed to delete phone. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const mainImage = phone.images && phone.images.length > 0
    ? phone.images[0]
    : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop';

  return (
    <>
      <Link
        to={`/phone/${phone.id}`}
        className="glass animate-fade-in"
        style={{
          borderRadius: '14px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          textDecoration: 'none',
          color: 'inherit',
          position: 'relative',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = 'var(--accent)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        {/* Admin Actions */}
        {isAdmin && (
          <div
            style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', display: 'flex', gap: '0.4rem', zIndex: 10 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); setEditOpen(true); }}
              title="Edit"
              style={{
                padding: '0.35rem',
                borderRadius: '7px',
                background: 'rgba(59, 130, 246, 0.85)',
                color: 'white',
                border: 'none',
                display: 'flex',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'opacity 0.2s'
              }}
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete"
              style={{
                padding: '0.35rem',
                borderRadius: '7px',
                background: deleting ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.85)',
                color: 'white',
                border: 'none',
                display: 'flex',
                cursor: deleting ? 'not-allowed' : 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'opacity 0.2s'
              }}
            >
              {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            </button>
          </div>
        )}

        {/* Image */}
        <div style={{ position: 'relative', height: '170px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
          <img
            src={mainImage}
            alt={phone.model}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }}
          />
          <div style={{
            position: 'absolute', top: '0.5rem', right: '0.5rem',
            background: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(6px)',
            padding: '0.2rem 0.5rem',
            borderRadius: '6px',
            fontSize: '0.6rem',
            fontWeight: 700,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {phone.condition}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '0.9rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{phone.brand}</p>
          <h3 style={{ fontSize: '0.92rem', marginBottom: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{phone.model}</h3>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)' }}>
              {new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(phone.price)}
            </span>
            <div className="btn-primary" style={{ padding: '0.35rem', borderRadius: '8px' }}>
              <ExternalLink size={13} />
            </div>
          </div>
        </div>
      </Link>

      {/* Edit Popup */}
      {editOpen && (
        <EditPhoneModal
          phone={phone}
          onClose={() => setEditOpen(false)}
          onUpdated={(updated) => {
            // Update is reflected by parent re-fetch or locally
            setEditOpen(false);
          }}
        />
      )}
    </>
  );
};

export default PhoneCard;
