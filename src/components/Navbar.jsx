import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { state } = useStore();
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav style={{
      background: 'white',
      borderBottom: '2px solid #F7EFD8',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(192,39,45,0.07)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#C0272D', letterSpacing: 1 }}>
            RATIRAJ
          </span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: 3, color: '#C9A84C', fontWeight: 500 }}>
            JEWELS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="nav-desktop">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              fontSize: 15,
              color: isActive(l.to) ? '#C0272D' : '#444',
              textDecoration: 'none',
              paddingBottom: 2,
              borderBottom: isActive(l.to) ? '2px solid #C9A84C' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>
              {l.label}
            </Link>
          ))}
          {state.isAdmin ? (
            <Link to="/admin/dashboard" style={{
              background: '#C0272D',
              color: 'white',
              padding: '6px 16px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              Admin Panel
            </Link>
          ) : (
            <Link to="/admin/login" style={{
              background: 'transparent',
              color: '#bbb',
              padding: '5px 12px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 500,
              textDecoration: 'none',
              border: '1px solid #e8e0d0',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              🔒
            </Link>
          )}
        </div>

        {/* Mobile right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="nav-mobile">
          {state.isAdmin && (
            <Link to="/admin/dashboard" style={{
              background: '#C0272D',
              color: 'white',
              padding: '5px 12px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
            }}>
              Admin
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 5,
            }}
            aria-label="Toggle menu"
          >
            <span style={{ display: 'block', width: 22, height: 2, background: '#333', borderRadius: 2, transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', transition: 'all 0.2s' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#333', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#333', borderRadius: 2, transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none', transition: 'all 0.2s' }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'white',
          borderTop: '1px solid #F7EFD8',
          padding: '8px 0 16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        }}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '13px 24px',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                fontSize: 16,
                color: isActive(l.to) ? '#C0272D' : '#333',
                textDecoration: 'none',
                borderLeft: isActive(l.to) ? '3px solid #C9A84C' : '3px solid transparent',
              }}
            >
              {l.label}
            </Link>
          ))}
          {!state.isAdmin && (
            <Link
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '13px 24px',
                fontSize: 13,
                color: '#bbb',
                textDecoration: 'none',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              🔒 Admin Login
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 641px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile { display: none !important; }
        }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}