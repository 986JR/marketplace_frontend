import React, { useState } from 'react';
import { Phone, updatePhone } from '../services/api';
import { X, Save, Loader2, Image as ImageIcon, Plus } from 'lucide-react';

interface Props {
  phone: Phone;
  onClose: () => void;
  onUpdated: (updated: Phone) => void;
}

const EditPhoneModal: React.FC<Props> = ({ phone, onClose, onUpdated }) => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    brand: phone.brand || '',
    model: phone.model || '',
    price: String(phone.price || ''),
    condition: phone.condition || 'NEW',
    description: phone.description || '',
    specification: {
      RAM: (phone.specification as any)?.ram || (phone.specification as any)?.RAM || '',
      Storage: (phone.specification as any)?.storage || (phone.specification as any)?.Storage || '',
      Battery: (phone.specification as any)?.battery || (phone.specification as any)?.Battery || '',
      Camera: (phone.specification as any)?.camera || (phone.specification as any)?.Camera || '',
    }
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('spec_')) {
      const key = name.replace('spec_', '');
      setFormData(prev => ({ ...prev, specification: { ...prev.specification, [key]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
      setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    }
  };

  const removePreview = (idx: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');
    const data = new FormData();
    data.append('phone', new Blob([JSON.stringify({
      brand: formData.brand,
      model: formData.model,
      price: parseFloat(formData.price),
      condition: formData.condition,
      description: formData.description,
      specification: {
        RAM: formData.specification.RAM,
        Storage: formData.specification.Storage,
        Battery: formData.specification.Battery,
        Camera: formData.specification.Camera,
      }
    })], { type: 'application/json' }));
    newImages.forEach(img => data.append('images', img));

    try {
      const updated = await updatePhone(phone.id, data);
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update phone.');
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.6rem 0.8rem',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '0.88rem',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="glass"
        style={{
          borderRadius: '24px',
          padding: '2rem',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          scrollbarWidth: 'thin'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Edit — {phone.model}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Brand</label>
              <input name="brand" value={formData.brand} onChange={handleChange} style={inputStyle} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Model</label>
              <input name="model" value={formData.model} onChange={handleChange} style={inputStyle} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Price (TZS)</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} style={inputStyle} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Condition</label>
              <select name="condition" value={formData.condition} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="NEW" style={{ background: '#0f172a' }}>New</option>
                <option value="REFURBISHED" style={{ background: '#0f172a' }}>Refurbished</option>
                <option value="USED" style={{ background: '#0f172a' }}>Used</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {/* Specs */}
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Specifications</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {Object.keys(formData.specification).map(key => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{key}</label>
                  <input
                    name={`spec_${key}`}
                    value={(formData.specification as any)[key]}
                    onChange={handleChange}
                    placeholder={key === 'RAM' ? '8GB' : '...'}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* New Images */}
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Add New Images <span style={{ fontSize: '0.72rem' }}>(existing images are kept)</span>
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {previews.map((url, idx) => (
                <div key={idx} style={{ width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                  <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removePreview(idx)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={10} />
                  </button>
                </div>
              ))}
              <label style={{ width: '72px', height: '72px', borderRadius: '10px', border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', gap: '0.25rem', flexShrink: 0 }}>
                <Plus size={18} />
                <span style={{ fontSize: '0.65rem' }}>Add</span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: '0.82rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: saving ? 0.7 : 1 }}>
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPhoneModal;
