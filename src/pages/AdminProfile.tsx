import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { updateProfile } from '../services/api';
import { User, Mail, Phone, MessageCircle, Facebook, Instagram, Twitter, Save, Loader2, CheckCircle, Shield, Edit3 } from 'lucide-react';
import { ensureExternalUrl, normalizePhoneNumber } from '../utils/contact';

const AdminProfile: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    facebookLink: '',
    instagramLink: '',
    twitterLink: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/auth/me').then(res => {
      const d = res.data.data;
      setFormData({
        name: d.name || '',
        email: d.email || '',
        phoneNumber: d.phoneNumber || '',
        whatsappNumber: d.whatsappNumber || '',
        facebookLink: d.facebookLink || '',
        instagramLink: d.instagramLink || '',
        twitterLink: d.twitterLink || ''
      });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');
    const payload = {
      ...formData,
      phoneNumber: normalizePhoneNumber(formData.phoneNumber),
      whatsappNumber: normalizePhoneNumber(formData.whatsappNumber),
      facebookLink: ensureExternalUrl(formData.facebookLink),
      instagramLink: ensureExternalUrl(formData.instagramLink),
      twitterLink: ensureExternalUrl(formData.twitterLink),
    };
    try {
      await updateProfile(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
      <Loader2 className="animate-spin" size={32} color="var(--accent)" />
    </div>
  );

  const inputStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '0.9rem',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  };

  const field = (label: string, name: string, icon: React.ReactNode, placeholder?: string, type = 'text') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {icon} {label}
      </label>
      <input
        name={name}
        type={type}
        value={(formData as any)[name]}
        onChange={handleChange}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );

  return (
    <div className="container" style={{ maxWidth: '840px', paddingBottom: '5rem', paddingTop: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, flexShrink: 0 }}>
          {formData.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.75rem' }}>{formData.name || 'Admin'}</h1>
            <span style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--accent)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Shield size={10} /> Admin
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formData.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Identity */}
        <div className="glass" style={{ padding: '1.75rem', borderRadius: '20px' }}>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
            <Edit3 size={17} color="var(--accent)" /> Identity
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {field('Full Name', 'name', <User size={13} />, 'Your display name')}
            {field('Email Address', 'email', <Mail size={13} />, 'admin@example.com', 'email')}
          </div>
        </div>

        {/* Contact */}
        <div className="glass" style={{ padding: '1.75rem', borderRadius: '20px' }}>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
            <Phone size={17} color="var(--accent)" /> Contact Details
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.25rem' }}>(shown in footer & phone pages)</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {field('Phone Number', 'phoneNumber', <Phone size={13} />, '+255 7XX XXX XXX')}
            {field('WhatsApp Number', 'whatsappNumber', <MessageCircle size={13} />, '255712345678 (no +)')}
          </div>
        </div>

        {/* Social */}
        <div className="glass" style={{ padding: '1.75rem', borderRadius: '20px' }}>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
            <Instagram size={17} color="var(--accent)" /> Social Media
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.25rem' }}>(optional - only filled ones appear)</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {field('Facebook', 'facebookLink', <Facebook size={13} />, 'https://facebook.com/yourpage')}
            {field('Instagram', 'instagramLink', <Instagram size={13} />, 'https://instagram.com/yourhandle')}
            {field('Twitter / X', 'twitterLink', <Twitter size={13} />, 'https://twitter.com/yourhandle')}
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
          style={{ alignSelf: 'flex-start', padding: '0.85rem 2.5rem', fontSize: '1rem', opacity: saving ? 0.75 : 1 }}
        >
          {saving ? <><Loader2 className="animate-spin" size={18} /> Saving...</> :
            success ? <><CheckCircle size={18} /> Saved!</> :
              <><Save size={18} /> Save Profile</>}
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;

