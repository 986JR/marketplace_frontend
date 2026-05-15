import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPhone, updatePhone, getPhoneById, Phone } from '../services/api';
import { Save, Image as ImageIcon, Plus, X, Loader2, ChevronLeft } from 'lucide-react';

const PhoneForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price: '',
    condition: 'NEW',
    description: '',
    specification: {
      RAM: '',
      Storage: '',
      Battery: '',
      Camera: '',
      Screen: ''
    }
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (isEdit) {
      if (!id) return;
      getPhoneById(id).then(phone => {
        setFormData({
          brand: phone.brand,
          model: phone.model,
          price: phone.price.toString(),
          condition: phone.condition,
          description: phone.description || '',
          specification: {
            RAM: phone.specification?.ram || '',
            Storage: phone.specification?.storage || '',
            Battery: phone.specification?.battery || '',
            Camera: phone.specification?.camera || '',
            Screen: phone.specification?.screen || ''
          }
        });
        setExistingImages(phone.images || []);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('spec_')) {
      const specKey = name.replace('spec_', '');
      setFormData(prev => ({
        ...prev,
        specification: { ...prev.specification, [specKey]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const data = new FormData();
    data.append('phone', new Blob([JSON.stringify({
      brand: formData.brand,
      model: formData.model,
      price: parseFloat(formData.price),
      condition: formData.condition,
      description: formData.description,
      specification: formData.specification
    })], { type: 'application/json' }));

    images.forEach(image => {
      data.append('images', image);
    });

    try {
      if (isEdit) {
        if (!id) return;
        await updatePhone(parseInt(id, 10), data);
      } else {
        await createPhone(data);
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to save phone:', err);
      setSaving(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container" style={{ maxWidth: '800px', paddingBottom: '5rem' }}>
      <button onClick={() => navigate(-1)} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        background: 'none', 
        border: 'none', 
        color: 'var(--text-muted)', 
        cursor: 'pointer',
        marginBottom: '2rem'
      }}>
        <ChevronLeft size={20} /> Back
      </button>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{isEdit ? 'Edit Phone' : 'Add New Phone'}</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Basic Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Brand</label>
              <input name="brand" value={formData.brand} onChange={handleInputChange} className="glass" required placeholder="e.g. Apple" style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', color: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Model</label>
              <input name="model" value={formData.model} onChange={handleInputChange} className="glass" required placeholder="e.g. iPhone 15 Pro" style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', color: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Price (TZS)</label>
              <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="glass" required placeholder="0" style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', color: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Condition</label>
              <select name="condition" value={formData.condition} onChange={handleInputChange} className="glass" style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', background: 'var(--primary)' }}>
                <option value="NEW">New</option>
                <option value="REFURBISHED">Refurbished</option>
                <option value="USED">Used</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="glass" rows={4} placeholder="Tell us more about the phone..." style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', color: 'white', resize: 'vertical' }} />
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Specifications</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {Object.keys(formData.specification).map(key => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ textTransform: 'capitalize' }}>{key}</label>
                <input 
                  name={`spec_${key}`} 
                  value={(formData.specification as any)[key]} 
                  onChange={handleInputChange} 
                  className="glass" 
                  placeholder={`e.g. ${key === 'RAM' ? '8GB' : '...'}`} 
                  style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', color: 'white' }} 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Images</h3>
          
          {/* Existing Images */}
          {isEdit && existingImages.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Current Images:</p>
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {existingImages.map((img, idx) => (
                  <div key={idx} style={{ width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    <img src={img} alt="Existing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Previews */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {previews.map((url, idx) => (
              <div key={idx} style={{ width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                <img src={url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <label style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '10px', 
              border: '2px dashed var(--border)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              color: 'var(--text-muted)',
              transition: '0.3s'
            }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
              <Plus size={24} />
              <span style={{ fontSize: '0.8rem' }}>Add</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="btn-primary" 
          style={{ padding: '1rem 2rem', fontSize: '1.1rem', alignSelf: 'flex-start' }}
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          {saving ? 'Saving...' : (isEdit ? 'Update Phone' : 'Add Phone')}
        </button>
      </form>
    </div>
  );
};

export default PhoneForm;
