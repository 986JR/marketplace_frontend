import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Twitter, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { getContactInfo, ContactInfo } from '../services/api';

const Footer: React.FC = () => {
  const [contact, setContact] = useState<ContactInfo | null>(null);

  useEffect(() => {
    getContactInfo().then(setContact).catch(console.error);
  }, []);

  const socialLinks = [
    { icon: <MessageCircle size={18} />, href: contact?.whatsappNumber ? `https://wa.me/${contact.whatsappNumber.replace(/\D/g, '')}` : null, label: 'WhatsApp', color: '#25D366' },
    { icon: <Instagram size={18} />, href: contact?.instagramLink || null, label: 'Instagram', color: '#E1306C' },
    { icon: <Facebook size={18} />, href: contact?.facebookLink || null, label: 'Facebook', color: '#1877F2' },
    { icon: <Twitter size={18} />, href: contact?.twitterLink || null, label: 'Twitter/X', color: '#1DA1F2' },
  ].filter(s => s.href);

  return (
    <footer style={{
      marginTop: '5rem',
      padding: '4rem 0 2rem',
      background: 'rgba(10, 17, 34, 0.95)',
      borderTop: '1px solid var(--border)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand */}
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--accent)' }}>Balozi Phones</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              Quality phones at unbeatable prices in Dodoma.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent)' }} />
              <span>Barabara ya Sita, Dodoma — Mkabala na Kitwizi Accessories</span>
            </div>
          </div>

          {/* Contact Info — fully dynamic from admin */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', fontWeight: 600 }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'white')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Mail size={15} color="var(--accent)" />
                  {contact.email}
                </a>
              )}
              {contact?.phoneNumber && (
                <a
                  href={`tel:${contact.phoneNumber}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'white')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Phone size={15} color="var(--accent)" />
                  {contact.phoneNumber}
                </a>
              )}
              {contact?.whatsappNumber && (
                <a
                  href={`https://wa.me/${contact.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'white')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <MessageCircle size={15} color="#25D366" />
                  WhatsApp: {contact.whatsappNumber}
                </a>
              )}
              {!contact?.phoneNumber && !contact?.whatsappNumber && !contact?.email && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Contact details not set yet.</p>
              )}
            </div>
          </div>

          {/* Social Links — only shown if set */}
          {socialLinks.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', fontWeight: 600 }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)',
                      transition: 'all 0.25s',
                      textDecoration: 'none'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = social.color + '22';
                      e.currentTarget.style.borderColor = social.color;
                      e.currentTarget.style.color = social.color;
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          © {new Date().getFullYear()} Balozi Phones. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
