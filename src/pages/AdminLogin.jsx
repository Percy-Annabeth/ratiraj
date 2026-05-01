import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { dispatch } = useStore();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === 'admin123') {
      dispatch({ type: 'LOGIN_ADMIN' });
      navigate('/admin/dashboard');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: '#fdf9f3' }}>
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '40px 32px',
        width: '100%',
        maxWidth: 380,
        boxShadow: '0 8px 40px rgba(192,39,45,0.1)',
        border: '1.5px solid #f0e8d8',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C0272D, #9B1B20)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 26,
          }}>
            🔒
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, margin: '0 0 6px', color: '#1a1a1a' }}>Admin Access</h1>
          <p style={{ fontSize: 13, color: '#888', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>Ratiraj Jewels — Restricted Area</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter admin password"
            autoFocus
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: `1.5px solid ${error ? '#C0272D' : '#e8e0d0'}`,
              fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p style={{ color: '#C0272D', fontSize: 12, margin: '6px 0 0', fontFamily: 'DM Sans, sans-serif' }}>{error}</p>
          )}
        </div>

        <button
          onClick={handleLogin}
          className="btn-primary"
          style={{ width: '100%', padding: '13px', fontSize: 15, borderRadius: 10 }}
        >
          Sign In
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#bbb', fontFamily: 'DM Sans, sans-serif' }}>
          This area is for store administrators only.
        </p>
      </div>
    </div>
  );
}