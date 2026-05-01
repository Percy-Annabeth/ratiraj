import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#1a0a0b', color: '#e0d0c0', padding: '48px 16px 24px', marginTop: 64 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#C9A84C', letterSpacing: 2, marginBottom: 4 }}>
              RATIRAJ
            </div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: '#C0272D', fontWeight: 600, marginBottom: 16 }}>
              JEWELS
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: '#b0a090', maxWidth: 220, margin: 0 }}>
              Crafting heirloom-quality jewellery since 2010. Each piece tells a story of tradition and elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 2, marginBottom: 16, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, margin: '0 0 16px' }}>
              QUICK LINKS
            </h4>
            {[['/', 'Home'], ['/products', 'Products'], ['/contact', 'Contact Us']].map(([to, label]) => (
              <div key={to} style={{ marginBottom: 10 }}>
                <Link to={to} style={{ color: '#c0b0a0', textDecoration: 'none', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>
                  {label}
                </Link>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 2, marginBottom: 16, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, margin: '0 0 16px' }}>
              CATEGORIES
            </h4>
            {['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Jewellery Sets'].map(cat => (
              <div key={cat} style={{ marginBottom: 10 }}>
                <Link to={`/products?category=${cat.toLowerCase().replace(' ', '')}`}
                  style={{ color: '#c0b0a0', textDecoration: 'none', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>
                  {cat}
                </Link>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 2, marginBottom: 16, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, margin: '0 0 16px' }}>
              CONNECT
            </h4>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'WhatsApp', href: 'https://wa.me/919876543210', emoji: '📱' },
                { label: 'Instagram', href: 'https://instagram.com', emoji: '📸' },
                { label: 'Facebook', href: 'https://facebook.com', emoji: '👍' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: '#2d1010', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none' }}>
                  {s.emoji}
                </a>
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#b0a090', lineHeight: 1.7, margin: '0 0 4px' }}>📍 Jewellery Market, Faridabad, Haryana</p>
            <p style={{ fontSize: 13, color: '#b0a090', margin: 0 }}>📞 +91 98765 43210</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #2d1010', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 12, color: '#806050', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
            © 2025 Ratiraj Jewels. All rights reserved. Cash on Delivery available.
          </p>
          <Link to="/admin/login" style={{ fontSize: 11, color: '#2d1010', textDecoration: 'none' }}>🔒</Link>
        </div>
      </div>
    </footer>
  );
}