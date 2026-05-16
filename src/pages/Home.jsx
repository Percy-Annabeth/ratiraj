import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

// ─── THEME COLOR VARIABLES ──────────────────────────────────────────────────
const C = {
  // Dark backgrounds (hero, banners, about)
  heroBgStart:      '#2c0000',
  heroBgMid:        '#510008',

  // Light section backgrounds
  sectionBgLight:   '#FDF3D0',   // was #FAFAFA
  sectionBgWarm:    '#FDF3D0',   // was #fdf9f3

  // Card / tile backgrounds
  cardBg:           '#FFFBF0',   // was white
  cardBorder:       '#F0D080',   // was #f0e8d8

  // Accent colors
  crimson:          '#c9050b',   // bright red accent
  gold:             '#C9A84C',   // primary gold
  goldGlow:         'rgba(201,168,76,0.15)',
  goldGlowBorder:   'rgba(201,168,76,0.3)',

  // Text on dark backgrounds
  textHeadingDark:  '#C9A84C',   // was white — now gold
  textBodyDark:     '#C4A060',   // was #b0a090

  // Text on light backgrounds
  textHeadingLight: '#c9050b',   // unchanged
  textMuted:        '#8B6420',   // was #888
  textStat:         '#8B6420',   // was #806050
  textCard:         '#444',      // unchanged

  // Featured banner
  featuredOriginal: '#8B6420',   // was #806050

  // Deals badge
  dealsIconBg:      '#fff0f0',   // was #fff5f5
  dealsBorder:      '#ffd0d0',   // unchanged

  // Why Us cards
  whyCardBg:        '#FDF3D0',   // was #fdf9f3
  whyCardBorder:    '#F0D080',   // was #f0e8d8
  whyDesc:          '#8B6420',   // was #888
};
// ────────────────────────────────────────────────────────────────────────────

const CATEGORY_ICONS = [
  { id: 'rings', icon: '💍', label: 'Rings' },
  { id: 'necklaces', icon: '📿', label: 'Necklaces' },
  { id: 'earrings', icon: '✨', label: 'Earrings' },
  { id: 'bracelets', icon: '🌟', label: 'Bracelets' },
  { id: 'birthday', icon: '🎁', label: 'Birthday' },
  { id: 'anniversary', icon: '❤️', label: 'Anniversary' },
  { id: 'jewellery', icon: '👑', label: 'Sets' },
];

export default function Home() {
  const { state } = useStore();
  const featured = state.products.find(p => p.featured);
  const deals = state.products.filter(p => p.dealOfWeek).slice(0, 2);
  const topProducts = state.products.filter(p => p.featured).slice(0, 4);

  return (
    <div>

      {/* ── Hero ── */}
      <section style={{
        background: `linear-gradient(135deg, ${C.heroBgStart} 0%, ${C.heroBgMid} 50%, ${C.heroBgStart} 100%)`,
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '60px 16px',
      }}>
        {/* decorative glows */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${C.goldGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,39,45,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: C.goldGlow, border: `1px solid ${C.goldGlowBorder}`, borderRadius: 999, padding: '6px 18px', marginBottom: 24 }}>
            <span style={{ color: C.gold, fontSize: 12, fontWeight: 600, letterSpacing: 2, fontFamily: 'DM Sans, sans-serif' }}>
              ✦ HANDCRAFTED WITH LOVE ✦
            </span>
          </div>

          {/* Site name in hero */}
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, letterSpacing: 5, color: C.gold, fontWeight: 500, margin: '0 0 8px', textTransform: 'uppercase' }}>
            Where Every Jewel Tells A Story
          </p>

          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.4rem, 7vw, 4.5rem)',
            color: C.textHeadingDark,
            lineHeight: 1.15,
            margin: '0 0 16px',
          }}>
            <span style={{ color: C.textHeadingDark, fontStyle: 'italic' }}>Ratiraj Bouterie Gallery</span>
          </h1>

          <p style={{ color: C.textBodyDark, fontSize: 16, maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' }}>
            Exquisite handcrafted jewellery for every occasion — from timeless classics to bold contemporary designs.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn-gold" style={{ fontSize: 15, padding: '13px 28px' }}>
              Shop Now ✦
            </Link>
            <Link to="/contact" style={{
              background: 'transparent',
              color: C.gold,
              fontSize: 15,
              padding: '13px 28px',
              borderRadius: 999,
              border: `2px solid ${C.gold}`,
              textDecoration: 'none',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}>
              Contact Us
            </Link>
          </div>

          {/* Stats */}
          <div style={{ marginTop: 48, display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['500+', 'Designs'], ['10K+', 'Happy Customers'], ['Since 2010', 'Trusted Brand']].map(([val, lab]) => (
              <div key={val} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.gold, fontFamily: 'DM Sans, sans-serif' }}>{val}</div>
                <div style={{ fontSize: 12, color: C.textStat, fontFamily: 'DM Sans, sans-serif', marginTop: 2 }}>{lab}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Quick Links ── */}
      <section style={{ padding: '52px 16px', background: C.sectionBgLight }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: C.textHeadingLight, marginBottom: 6, margin: '0 0 6px' }}>
            Shop by <span style={{ color: C.crimson }}>Category</span>
          </h2>
          <p style={{ textAlign: 'center', color: C.textMuted, marginBottom: 32, fontFamily: 'DM Sans, sans-serif', fontSize: 14, margin: '6px 0 32px' }}>
            Find the perfect piece for every occasion
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 12 }}>
            {CATEGORY_ICONS.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: C.cardBg,
                    borderRadius: 16,
                    padding: '18px 8px',
                    textAlign: 'center',
                    border: `1.5px solid ${C.cardBorder}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = C.gold;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${C.goldGlow}`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = C.cardBorder;
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{cat.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.textCard, fontFamily: 'DM Sans, sans-serif', letterSpacing: 0.3 }}>{cat.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Product Banner ── */}
      {featured && (
        <section style={{ padding: '0 16px 52px', background: C.sectionBgLight }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{
              background: `linear-gradient(135deg, ${C.heroBgMid} 0%, ${C.heroBgStart} 100%)`,
              borderRadius: 24,
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              alignItems: 'center',
            }}>
              <div style={{ padding: '40px 32px' }}>
                <div style={{ display: 'inline-block', background: 'rgba(201,168,76,0.2)', borderRadius: 999, padding: '5px 14px', marginBottom: 16 }}>
                  <span style={{ color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>⭐ TOP PRODUCT</span>
                </div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: C.gold, margin: '0 0 12px', lineHeight: 1.2 }}>
                  {featured.name}
                </h2>
                <p style={{ color: C.textBodyDark, fontSize: 14, lineHeight: 1.7, marginBottom: 24, fontFamily: 'DM Sans, sans-serif', maxWidth: 380, margin: '0 0 24px' }}>
                  {featured.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 28 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: C.gold, fontFamily: 'DM Sans, sans-serif' }}>
                    ₹{featured.price.toLocaleString('en-IN')}
                  </span>
                  {featured.originalPrice && (
                    <span style={{ fontSize: 16, color: C.featuredOriginal, textDecoration: 'line-through', fontFamily: 'DM Sans, sans-serif' }}>
                      ₹{featured.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <Link to={`/products/${featured.id}`} className="btn-gold">
                  View Product →
                </Link>
              </div>
              <div style={{ aspectRatio: '1/1', overflow: 'hidden', maxHeight: 420 }}>
                <img
                  src={featured.image}
                  alt={featured.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/600/F7EFD8/C9A84C?text=Ratiraj+Jewels'; }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Deals of the Week ── */}
      {deals.length > 0 && (
        <section style={{ padding: '0 16px 56px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.dealsIconBg, border: `1px solid ${C.dealsBorder}`, borderRadius: 999, padding: '6px 16px', marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>🔥</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.crimson, letterSpacing: 1, fontFamily: 'DM Sans, sans-serif' }}>DEALS OF THE WEEK</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: 0, color: C.textHeadingLight }}>
                This Week's <span style={{ color: C.crimson }}>Best Offers</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {deals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Link to="/products" className="btn-outline">View All Products</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Collection ── */}
      <section style={{ padding: '0 16px 64px', background: C.sectionBgWarm }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 52 }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 6, color: C.textHeadingLight, margin: '0 0 6px' }}>
            Our Featured Collection
          </h2>
          <p style={{ textAlign: 'center', color: C.textMuted, marginBottom: 36, fontFamily: 'DM Sans, sans-serif', fontSize: 14, margin: '6px 0 36px' }}>
            Handpicked favourites loved by our customers
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
            {topProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/products" className="btn-primary">Browse Full Collection →</Link>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section style={{ padding: '56px 16px', background: C.cardBg }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 40, color: C.textHeadingLight, margin: '0 0 40px' }}>
            Why Choose <span style={{ color: C.crimson }}>Ratiraj Bouterie Gallery</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { icon: '🚚', title: 'Cash on Delivery', desc: 'Pay when you receive. No advance payment required.' },
              { icon: '💎', title: 'Premium Quality', desc: 'Hallmarked jewellery with quality certifications.' },
              { icon: '🔄', title: 'Easy Returns', desc: '7-day hassle-free return policy on all orders.' },
              { icon: '📞', title: '24/7 Support', desc: 'Reach us on WhatsApp anytime for queries.' },
            ].map(item => (
              <div key={item.title} style={{ textAlign: 'center', padding: 24, borderRadius: 16, background: C.whyCardBg, border: `1px solid ${C.whyCardBorder}` }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, margin: '0 0 8px', color: C.textHeadingLight, fontFamily: 'Playfair Display, serif' }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: C.whyDesc, margin: 0, lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Snippet ── */}
      <section style={{ padding: '56px 16px', background: `linear-gradient(135deg, ${C.heroBgStart}, ${C.heroBgMid})` }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 16, color: C.gold }}>✦</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: C.gold, marginBottom: 16, margin: '0 0 16px' }}>
            Our Story
          </h2>
          <p style={{ color: C.textBodyDark, fontSize: 15, lineHeight: 1.8, fontFamily: 'DM Sans, sans-serif', marginBottom: 28, margin: '0 0 28px' }}>
            Ratiraj Bouterie Gallery was born from a deep love for the art of jewellery-making. For over a decade, we have been crafting pieces that blend traditional Indian craftsmanship with contemporary elegance. Every ring, necklace, and earring in our collection carries the legacy of skilled artisans and the promise of lasting beauty.
          </p>
          <Link to="/contact" style={{ color: C.gold, textDecoration: 'none', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', borderBottom: `1px solid ${C.gold}`, paddingBottom: 2 }}>
            Get in Touch →
          </Link>
        </div>
      </section>

    </div>
  );
}