import { Link } from 'react-router-dom';

// ─── THEME COLOR VARIABLES ──────────────────────────────────────────────────
const C = {
  // Backgrounds
  footerBg:         '#1a0000',   // was #1a0a0b
  socialBg:         '#2d0000',   // was #2d1010
  borderColor:      '#2d0000',   // was #2d1010

  // Accent colors
  crimson:          '#C0272D',   // was #C0272D (unchanged)
  gold:             '#C9A84C',   // was #C9A84C (unchanged)

  // Text
  textBody:         '#C4A060',   // was #e0d0c0
  textMuted:        '#C4A060',   // was #c0b0a0
  textFaint:        '#8B6420',   // was #806050
  textHidden:       '#2d0000',   // admin lock (was #2d1010)
};
// ────────────────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer style={{ background: C.footerBg, color: C.textBody, padding: '48px 16px 24px', marginTop: 64 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: C.gold, letterSpacing: 2, marginBottom: 4 }}>
              RATIRAJ
            </div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: C.crimson, fontWeight: 600, marginBottom: 16 }}>
              JEWELS
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: C.textMuted, maxWidth: 220, margin: 0 }}>
              Crafting heirloom-quality jewellery since 2010. Each piece tells a story of tradition and elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: C.gold, fontSize: 12, letterSpacing: 2, marginBottom: 16, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, margin: '0 0 16px' }}>
              QUICK LINKS
            </h4>
            {[['/', 'Home'], ['/products', 'Products'], ['/contact', 'Contact Us']].map(([to, label]) => (
              <div key={to} style={{ marginBottom: 10 }}>
                <Link to={to} style={{ color: C.textMuted, textDecoration: 'none', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>
                  {label}
                </Link>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: C.gold, fontSize: 12, letterSpacing: 2, marginBottom: 16, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, margin: '0 0 16px' }}>
              CATEGORIES
            </h4>
            {['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Jewellery Sets'].map(cat => (
              <div key={cat} style={{ marginBottom: 10 }}>
                <Link to={`/products?category=${cat.toLowerCase().replace(' ', '')}`}
                  style={{ color: C.textMuted, textDecoration: 'none', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>
                  {cat}
                </Link>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: C.gold, fontSize: 12, letterSpacing: 2, marginBottom: 16, fontFamily: 'DM Sans, sans-serif', fontWeight: 700, margin: '0 0 16px' }}>
              CONNECT
            </h4>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'WhatsApp', href: 'https://wa.me/919876543210', emoji: '📱' },
                { label: 'Instagram', href: 'https://instagram.com', emoji: '📸' },
                { label: 'Facebook', href: 'https://facebook.com', emoji: '👍' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: C.socialBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none' }}>
                  {s.emoji}
                </a>
              ))}
            </div>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, margin: '0 0 4px' }}>📍 Jewellery Market, Faridabad, Haryana</p>
            <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>📞 +91 98765 43210</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${C.borderColor}`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 12, color: C.textFaint, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
            © 2025 Ratiraj Jewels. All rights reserved. Cash on Delivery available.
          </p>
          <Link to="/admin/login" style={{ fontSize: 11, color: C.textHidden, textDecoration: 'none' }}>🔒</Link>
        </div>
      </div>
    </footer>
  );
}