import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore, WHATSAPP_NUMBER } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const WA_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function ProductDetail() {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const [qty, setQty] = useState(1);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const product = state.products.find(p => p.id === id);

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '80px 16px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>💎</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#C0272D' }}>Product not found</h2>
      <Link to="/products" className="btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>
        Back to Products
      </Link>
    </div>
  );

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const related = state.products
    .filter(p => p.id !== product.id && (p.category === product.category || (p.tags && p.tags.some(t => product.tags?.includes(t)))))
    .slice(0, 4);

  const handleWhatsAppOrder = () => {
    const msg = encodeURIComponent([
      `🛒 *New Order — Ratiraj Jewels*`,
      ``,
      `📦 *Product:* ${product.name}`,
      `💰 *Price:* ₹${product.price.toLocaleString('en-IN')} × ${qty} = ₹${(product.price * qty).toLocaleString('en-IN')}`,
      `🏷️ *Category:* ${product.category}`,
      ``,
      `👤 *Customer Name:* ${name}`,
      `📞 *Phone:* ${phone}`,
      `📍 *Address:* ${address}`,
      ``,
      `💵 *Payment:* Cash on Delivery`,
      ``,
      `_Sent from Ratiraj Jewels website_`,
    ].join('\n'));

    dispatch({
      type: 'ADD_ORDER',
      order: {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        price: product.price,
        qty,
        total: product.price * qty,
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        status: 'Pending',
        date: new Date().toISOString(),
      },
    });

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    setOrderPlaced(true);
    setShowOrderForm(false);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>

      {/* Breadcrumb */}
      <nav style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: '#888', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <Link to="/products" style={{ color: '#888', textDecoration: 'none' }}>Products</Link>
        <span>›</span>
        <span style={{ color: '#C0272D', fontWeight: 500 }}>{product.name}</span>
      </nav>

      {/* Product */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, marginBottom: 56 }}>

        {/* Image */}
        <div style={{ borderRadius: 20, overflow: 'hidden', background: '#fdf8f0', aspectRatio: '1/1', maxHeight: 500 }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = 'https://via.placeholder.com/600x600/F7EFD8/C9A84C?text=Ratiraj+Jewels'; }}
          />
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ background: '#F7EFD8', color: '#C9A84C', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, letterSpacing: 1, fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase' }}>
              {product.category}
            </span>
            {discount && (
              <span style={{ background: '#fff0f0', color: '#C0272D', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, fontFamily: 'DM Sans, sans-serif' }}>
                {discount}% OFF
              </span>
            )}
            {product.dealOfWeek && (
              <span style={{ background: '#fffbea', color: '#d97706', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, fontFamily: 'DM Sans, sans-serif' }}>
                🔥 Deal of the Week
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#1a1a1a', margin: 0, lineHeight: 1.2 }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: '#C0272D', fontFamily: 'DM Sans, sans-serif' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: 18, color: '#aaa', textDecoration: 'line-through', fontFamily: 'DM Sans, sans-serif' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {discount && (
              <span style={{ fontSize: 14, color: '#16a34a', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
                Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* COD badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', borderRadius: 10, padding: '10px 16px', border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: 18 }}>💵</span>
            <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
              Cash on Delivery Available
            </span>
          </div>

          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#555', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
            {product.description}
          </p>

          {/* Stock indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', display: 'inline-block',
              background: product.stock > 5 ? '#16a34a' : product.stock > 0 ? '#f59e0b' : '#C0272D',
            }} />
            <span style={{ fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: '#555' }}>
              {product.stock > 5
                ? `In Stock (${product.stock} available)`
                : product.stock > 0
                ? `Only ${product.stock} left!`
                : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity selector */}
          {product.stock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#555', fontFamily: 'DM Sans, sans-serif' }}>Qty:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e8e0d0', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ padding: '8px 14px', background: 'white', border: 'none', cursor: 'pointer', fontSize: 18, color: '#C0272D', fontWeight: 700, lineHeight: 1 }}>−</button>
                <span style={{ padding: '8px 16px', fontSize: 15, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', minWidth: 36, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  style={{ padding: '8px 14px', background: 'white', border: 'none', cursor: 'pointer', fontSize: 18, color: '#C0272D', fontWeight: 700, lineHeight: 1 }}>+</button>
              </div>
              <span style={{ fontSize: 14, color: '#C0272D', fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>
                Total: ₹{(product.price * qty).toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {/* Action buttons */}
          {product.stock > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
              <button
                onClick={() => setShowOrderForm(true)}
                style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: 12, padding: '14px 20px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif' }}
              >
                {WA_ICON} Buy via WhatsApp
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in "${product.name}" (₹${product.price.toLocaleString('en-IN')}). Can you tell me more?`)}`}
                target="_blank" rel="noreferrer"
                style={{ background: 'white', color: '#555', border: '1.5px solid #e8e0d0', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' }}
              >
                💬 Ask a Question
              </a>
            </div>
          ) : (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
              <p style={{ color: '#C0272D', fontWeight: 600, margin: '0 0 6px', fontFamily: 'DM Sans, sans-serif' }}>Currently Out of Stock</p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'd like to know when "${product.name}" will be back in stock.`)}`}
                target="_blank" rel="noreferrer"
                style={{ fontSize: 13, color: '#C0272D', fontFamily: 'DM Sans, sans-serif' }}>
                Notify me when available →
              </a>
            </div>
          )}

          {/* Tags */}
          {product.tags && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 4 }}>
              {product.tags.map(tag => (
                <Link key={tag} to={`/products?category=${tag}`}
                  style={{ fontSize: 11, color: '#999', background: '#f5f5f5', padding: '3px 10px', borderRadius: 999, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order success banner */}
      {orderPlaced && (
        <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 16, padding: '20px 24px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>✅</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#16a34a', fontFamily: 'DM Sans, sans-serif' }}>Order sent via WhatsApp!</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#555', fontFamily: 'DM Sans, sans-serif' }}>Our team will confirm your order shortly. Payment: Cash on Delivery.</p>
          </div>
        </div>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: '#1a1a1a', marginBottom: 24, margin: '0 0 24px' }}>
            You May Also <span style={{ color: '#C9A84C' }}>Like</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Order form modal */}
      {showOrderForm && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowOrderForm(false); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div style={{ background: 'white', borderRadius: '24px 24px 0 0', padding: '32px 24px', width: '100%', maxWidth: 480, maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', margin: 0, fontSize: 18 }}>Place Order via WhatsApp</h3>
              <button onClick={() => setShowOrderForm(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888', lineHeight: 1 }}>×</button>
            </div>

            {/* Product summary */}
            <div style={{ background: '#f9f6f0', borderRadius: 12, padding: 14, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
              <img src={product.image} alt="" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>{product.name}</p>
                <p style={{ margin: '4px 0 0', color: '#C0272D', fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>
                  ₹{(product.price * qty).toLocaleString('en-IN')} × {qty}
                </p>
              </div>
            </div>

            {/* Fields */}
            {[
              { label: 'Your Name *', value: name, setter: setName, placeholder: 'Full name', type: 'text' },
              { label: 'Phone Number *', value: phone, setter: setPhone, placeholder: '+91 98765 43210', type: 'tel' },
              { label: 'Delivery Address *', value: address, setter: setAddress, placeholder: 'House no., Street, City, Pincode', type: 'textarea' },
            ].map(field => (
              <div key={field.label} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea value={field.value} onChange={e => field.setter(e.target.value)} placeholder={field.placeholder} rows={3}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e8e0d0', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                ) : (
                  <input type={field.type} value={field.value} onChange={e => field.setter(e.target.value)} placeholder={field.placeholder}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e8e0d0', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                )}
              </div>
            ))}

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#16a34a', fontFamily: 'DM Sans, sans-serif' }}>
              💵 Payment: <strong>Cash on Delivery</strong> — Pay when you receive your order
            </div>

            <button
              onClick={handleWhatsAppOrder}
              disabled={!name || !phone || !address}
              style={{
                width: '100%',
                background: (!name || !phone || !address) ? '#ccc' : '#25D366',
                color: 'white', border: 'none', borderRadius: 12, padding: '14px',
                fontSize: 16, fontWeight: 700,
                cursor: (!name || !phone || !address) ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {WA_ICON} Send Order on WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}