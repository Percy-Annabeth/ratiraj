import { WHATSAPP_NUMBER } from '../context/StoreContext';

const CONTACTS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    label: 'WhatsApp',
    desc: 'Chat with us instantly',
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I want to know more about your jewellery collection.')}`,
    bg: '#25D366',
    color: 'white',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    label: 'Instagram',
    desc: 'Follow our latest designs',
    href: 'https://instagram.com/ratirajjewels',
    bg: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
    color: 'white',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    label: 'Facebook',
    desc: 'Like our Facebook page',
    href: 'https://facebook.com/ratirajjewels',
    bg: '#1877F2',
    color: 'white',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.908 1.528-1.147C21.69 2.28 24 3.434 24 5.457z"/>
      </svg>
    ),
    label: 'Gmail',
    desc: 'Send us an email',
    href: 'mailto:ratirajjewels@gmail.com',
    bg: '#EA4335',
    color: 'white',
  },
];

export default function Contact() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1a0a0b, #2d1010)', padding: '56px 16px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 999, padding: '6px 18px', marginBottom: 20 }}>
          <span style={{ color: '#C9A84C', fontSize: 12, fontWeight: 600, letterSpacing: 2, fontFamily: 'DM Sans, sans-serif' }}>✦ WE'D LOVE TO HEAR FROM YOU ✦</span>
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'white', margin: '0 0 12px' }}>
          Get in <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>Touch</span>
        </h1>
        <p style={{ color: '#b0a090', fontSize: 15, maxWidth: 480, margin: '0 auto', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7 }}>
          Questions about an order, custom requests, or just want to say hi? We're always here to help.
        </p>
      </section>

      {/* Contact Cards */}
      <section style={{ padding: '56px 16px', background: '#FAFAFA' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', margin: '0 0 8px', color: '#1a1a1a' }}>
            Reach Us <span style={{ color: '#C0272D' }}>Directly</span>
          </h2>
          <p style={{ textAlign: 'center', color: '#888', marginBottom: 36, fontFamily: 'DM Sans, sans-serif', fontSize: 14, margin: '8px 0 36px' }}>
            Tap any button below to connect with us instantly
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CONTACTS.map(c => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '18px 24px',
                  borderRadius: 16,
                  background: c.bg,
                  color: c.color,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; }}
              >
                <div style={{ flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, fontFamily: 'DM Sans, sans-serif' }}>{c.label}</div>
                  <div style={{ fontSize: 13, opacity: 0.85, fontFamily: 'DM Sans, sans-serif' }}>{c.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 20, opacity: 0.7 }}>→</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Order CTA */}
      <section style={{ padding: '0 16px 56px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ background: 'white', border: '1.5px solid #f0e8d8', borderRadius: 20, padding: '36px 24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(192,39,45,0.06)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💎</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', margin: '0 0 10px', color: '#1a1a1a' }}>
              Custom Order Enquiry
            </h3>
            <p style={{ fontSize: 14, color: '#777', lineHeight: 1.7, maxWidth: 400, margin: '0 auto 24px', fontFamily: 'DM Sans, sans-serif' }}>
              Looking for something unique? We craft custom jewellery pieces for weddings, anniversaries, and special occasions. Tell us your dream piece!
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like to enquire about a custom jewellery order from Ratiraj Jewels.")}`}
              target="_blank"
              rel="noreferrer"
              style={{ background: '#25D366', color: 'white', padding: '14px 32px', borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section style={{ background: '#1a0a0b', padding: '40px 16px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 24, textAlign: 'center' }}>
          {[
            { icon: '⏰', title: 'Business Hours', desc: 'Mon–Sat: 10am–8pm\nSun: 11am–6pm' },
            { icon: '📍', title: 'Visit Us', desc: 'Jewellery Market\nFaridabad, Haryana' },
            { icon: '💵', title: 'Payment', desc: 'Cash on Delivery\nNo advance required' },
          ].map(item => (
            <div key={item.title}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
              <h4 style={{ color: '#C9A84C', fontSize: 12, letterSpacing: 1.5, margin: '0 0 6px', fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>
                {item.title.toUpperCase()}
              </h4>
              <p style={{ fontSize: 13, color: '#b0a090', margin: 0, lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif', whiteSpace: 'pre-line' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}