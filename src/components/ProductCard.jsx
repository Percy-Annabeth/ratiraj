import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(192,39,45,0.07), 0 1px 4px rgba(0,0,0,0.05)',
          border: '1px solid #f0e8d8',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(192,39,45,0.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(192,39,45,0.07), 0 1px 4px rgba(0,0,0,0.05)';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#fdf8f0' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'none'}
            onError={e => { e.target.src = 'https://via.placeholder.com/400x400/F7EFD8/C9A84C?text=Ratiraj'; }}
          />
          {/* Top-left badges */}
          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {discount && (
              <span style={{ background: '#C0272D', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, fontFamily: 'DM Sans, sans-serif' }}>
                -{discount}%
              </span>
            )}
            {product.dealOfWeek && (
              <span style={{ background: '#C9A84C', color: 'white', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 999, fontFamily: 'DM Sans, sans-serif' }}>
                🔥 Deal
              </span>
            )}
          </div>
          {/* Low stock */}
          {product.stock <= 3 && product.stock > 0 && (
            <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(192,39,45,0.9)', color: 'white', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 999 }}>
              Only {product.stock} left
            </div>
          )}
          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ background: 'rgba(0,0,0,0.8)', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px' }}>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: '#C9A84C', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
            {product.category}
          </p>
          <h3 style={{ margin: '0 0 10px', fontSize: 15, fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}
            className="line-clamp-2">
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#C0272D', fontFamily: 'DM Sans, sans-serif' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: 13, color: '#aaa', textDecoration: 'line-through', fontFamily: 'DM Sans, sans-serif' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}