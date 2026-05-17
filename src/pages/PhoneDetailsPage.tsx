import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPhoneById, getContactInfo, getReviews, addReview, Phone, ContactInfo } from '../services/api';
import { ChevronLeft, MessageCircle, Phone as PhoneIcon, ShieldCheck, Truck, RefreshCcw, Loader2, Star, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toTelHref, toWhatsAppHref } from '../utils/contact';

const PhoneDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const [phone, setPhone] = useState<Phone | null>(null);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (id) {
      Promise.all([getPhoneById(id), getContactInfo(), getReviews(parseInt(id))])
        .then(([phoneData, contactData, reviewData]) => {
          setPhone(phoneData);
          setContact(contactData);
          setReviews(reviewData || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || submittingReview) return;
    if (!newReview.comment.trim()) return;
    setSubmittingReview(true);
    setReviewError('');
    try {
      const savedReview = await addReview(parseInt(id), newReview);
      setReviews(prev => [savedReview, ...prev]);
      setNewReview({ rating: 5, comment: '' });
    } catch (err: any) {
      setReviewError(err?.response?.data?.message || 'Failed to post review. You may have already reviewed this phone.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="var(--accent)" />
      </div>
    );
  }

  if (!phone) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Phone not found</h2>
        <Link to="/" className="btn-outline" style={{ marginTop: '2rem', display: 'inline-flex' }}>Back to Home</Link>
      </div>
    );
  }

  const images = phone.images && phone.images.length > 0
    ? phone.images
    : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'];

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
        <ChevronLeft size={20} />
        Back to listing
      </Link>

      <div className="details-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Image Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '1/1', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <img src={images[activeImage]} alt={phone.model} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)} style={{ width: '72px', height: '72px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: `2px solid ${activeImage === idx ? 'var(--accent)' : 'transparent'}`, opacity: activeImage === idx ? 1 : 0.55, transition: '0.3s', background: 'rgba(255,255,255,0.05)', padding: '4px', cursor: 'pointer' }}>
                  <img src={img} alt={`view-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
              {phone.brand} - {phone.condition}
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', margin: '0.5rem 0 0.25rem' }}>{phone.model}</h1>
            {avgRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(parseFloat(avgRating)) ? '#fbbf24' : 'none'} color={i < Math.round(parseFloat(avgRating)) ? '#fbbf24' : 'var(--border)'} />
                ))}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>
              {new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(phone.price)}
            </p>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.8 }}>
            {phone.description || 'No description available for this device.'}
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {contact?.whatsappNumber ? (
              <a
                href={toWhatsAppHref(contact.whatsappNumber, `Hi, I am interested in the ${phone.model} (${phone.brand}) priced at TZS ${phone.price}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ flex: 1, minWidth: '140px', justifyContent: 'center', background: '#25D366', textDecoration: 'none' }}
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            ) : null}
            {contact?.phoneNumber ? (
              <a
                href={toTelHref(contact.phoneNumber)}
                className="btn-outline"
                style={{ flex: 1, minWidth: '140px', justifyContent: 'center', textDecoration: 'none' }}
              >
                <PhoneIcon size={18} />
                Call Now
              </a>
            ) : null}
          </div>

          {/* Specs */}
          {phone.specification && (
            <div className="glass" style={{ borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Specifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {Object.entries(phone.specification).filter(([, v]) => v).map(([key, value], i, arr) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize', fontSize: '0.9rem' }}>{key}</span>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {[
              { icon: <ShieldCheck size={22} color="var(--accent)" />, label: 'Original Quality' },
              { icon: <Truck size={22} color="var(--accent)" />, label: 'Fast Delivery' },
              { icon: <RefreshCcw size={22} color="var(--accent)" />, label: '7 Days Return' },
            ].map((b, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0.75rem 0.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                <div style={{ marginBottom: '0.3rem' }}>{b.icon}</div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section style={{ marginTop: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.75rem' }}>Customer Reviews</h2>
          {reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Star size={16} fill="#fbbf24" color="#fbbf24" />
              {avgRating} average - {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>

          {/* Review Form â€” users only */}
          <div className="glass review-form-card" style={{ padding: '1.75rem', borderRadius: '20px' }}>
            {isAdmin ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <Lock size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Admin View Only</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Admins cannot post reviews. Reviews are managed by customers.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>Leave a Review</h3>
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Star Selector */}
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Rating</p>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview(r => ({ ...r, rating: star }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform 0.1s' }}
                          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'}
                          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <Star size={26} fill={star <= newReview.rating ? '#fbbf24' : 'none'} color={star <= newReview.rating ? '#fbbf24' : 'var(--border)'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Share your experience with this phone..."
                    value={newReview.comment}
                    onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
                    rows={4}
                    required
                    style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'white', resize: 'vertical', minHeight: '100px', fontSize: '0.9rem' }}
                  />
                  {reviewError && (
                    <p style={{ color: '#f87171', fontSize: '0.82rem' }}>{reviewError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submittingReview || !newReview.comment.trim()}
                    className="btn-primary"
                    style={{ justifyContent: 'center', opacity: submittingReview || !newReview.comment.trim() ? 0.6 : 1 }}
                  >
                    {submittingReview ? <><Loader2 className="animate-spin" size={16} /> Posting...</> : 'Post Review'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Review List â€” scrollable, fixed height */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div className="reviews-scroll" style={{
              maxHeight: '480px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              paddingRight: '0.25rem',
              scrollbarWidth: 'thin',
            }}>
              {reviews.length > 0 ? reviews.map((review, i) => (
                <div key={i} className="glass" style={{ padding: '1.25rem', borderRadius: '14px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', gap: '0.2rem' }}>
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={13} fill={idx < review.rating ? '#fbbf24' : 'none'} color={idx < review.rating ? '#fbbf24' : 'var(--border)'} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p style={{ marginBottom: '0.75rem', fontSize: '0.9rem', lineHeight: 1.6 }}>{review.comment}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                      {review.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{review.username || 'Anonymous'}</span>
                  </div>
                </div>
              )) : (
                <div className="glass" style={{ padding: '3rem', borderRadius: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Star size={32} style={{ margin: '0 auto 0.75rem' }} />
                  <p>No reviews yet.</p>
                  {!isAdmin && <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Be the first to share your experience!</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PhoneDetailsPage;

