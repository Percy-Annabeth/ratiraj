import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';

const EMPTY_FORM = {
  name: '', price: '', originalPrice: '', category: 'rings',
  tags: [], description: '', image: '', stock: '', featured: false, dealOfWeek: false,
};

function ImageUploader({ value, onChange }) {
  const fileRef = useRef();
  const [urlInput, setUrlInput] = useState('');
  const [tab, setTab] = useState('url');

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1.5px solid #e8e0d0', marginBottom: 8 }}>
        {['url', 'upload'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: '8px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', background: tab === t ? '#C0272D' : 'white', color: tab === t ? 'white' : '#555', transition: 'all 0.15s' }}>
            {t === 'url' ? '🔗 Image URL' : '📁 Upload File'}
          </button>
        ))}
      </div>
      {tab === 'url' ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e8e0d0', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
          />
          <button
            onClick={() => { onChange(urlInput); setUrlInput(''); }}
            style={{ padding: '9px 14px', borderRadius: 8, background: '#C9A84C', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}
          >
            Set
          </button>
        </div>
      ) : (
        <div>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} style={{ display: 'none' }} />
          <button
            onClick={() => fileRef.current.click()}
            style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px dashed #C9A84C', background: '#fdf9f3', cursor: 'pointer', fontSize: 13, color: '#C9A84C', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}
          >
            Click to select image from device
          </button>
        </div>
      )}
      {value && (
        <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
          <img src={value} alt="preview"
            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #e8e0d0' }}
            onError={e => e.target.style.display = 'none'}
          />
          <button
            onClick={() => onChange('')}
            style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#C0272D', color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
          >×</button>
        </div>
      )}
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5, fontFamily: 'DM Sans, sans-serif' }}>
        {label}{required && ' *'}
      </label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e8e0d0', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e8e0d0', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
      )}
    </div>
  );
}

const STATUS_COLORS = { Pending: '#f59e0b', Confirmed: '#3b82f6', Delivered: '#16a34a', Cancelled: '#C0272D' };

export default function AdminDashboard() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [savedMsg, setSavedMsg] = useState('');

  if (!state.isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#C0272D' }}>Access Denied</h2>
        <button onClick={() => navigate('/admin/login')} className="btn-primary" style={{ marginTop: 16 }}>Go to Login</button>
      </div>
    );
  }

  const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = p => {
    setEditProduct(p);
    setForm({ ...p, price: String(p.price), originalPrice: String(p.originalPrice || ''), stock: String(p.stock), tags: p.tags || [] });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) return;
    const product = {
      ...form,
      id: editProduct ? editProduct.id : Date.now().toString(),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: Number(form.stock),
    };
    dispatch({ type: editProduct ? 'UPDATE_PRODUCT' : 'ADD_PRODUCT', product });
    setShowForm(false);
    setSavedMsg(editProduct ? 'Product updated!' : 'Product added!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleDelete = id => { dispatch({ type: 'DELETE_PRODUCT', id }); setDeleteConfirm(null); };
  const toggleTag = tag => setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));

  const stats = [
    { label: 'Products', value: state.products.length, icon: '💎', color: '#C9A84C' },
    { label: 'Total Orders', value: state.orders.length, icon: '📦', color: '#3b82f6' },
    { label: 'Pending', value: state.orders.filter(o => o.status === 'Pending').length, icon: '⏳', color: '#f59e0b' },
    { label: 'Est. Revenue', value: '₹' + state.orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.total || 0), 0).toLocaleString('en-IN'), icon: '💰', color: '#16a34a' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', margin: '0 0 4px', color: '#1a1a1a' }}>
            Admin <span style={{ color: '#C0272D' }}>Dashboard</span>
          </h1>
          <p style={{ margin: 0, color: '#888', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>Ratiraj Jewels — Store Management</p>
        </div>
        <button
          onClick={() => { dispatch({ type: 'LOGOUT_ADMIN' }); navigate('/'); }}
          style={{ padding: '9px 16px', borderRadius: 10, border: '1.5px solid #e8e0d0', background: 'white', cursor: 'pointer', fontSize: 13, color: '#888', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}
        >
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: 14, padding: '16px', border: '1.5px solid #f0e8d8' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: 'DM Sans, sans-serif' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#888', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, background: '#f0e8d8', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {['products', 'orders'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 20px', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', background: tab === t ? 'white' : 'transparent', color: tab === t ? '#C0272D' : '#888', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
            {t === 'products' ? `💎 Products (${state.products.length})` : `📦 Orders (${state.orders.length})`}
          </button>
        ))}
      </div>

      {savedMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#16a34a', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
          ✅ {savedMsg}
        </div>
      )}

      {/* Products tab */}
      {tab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: '9px 18px' }}>
              + Add New Product
            </button>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {state.products.map(p => (
              <div key={p.id} style={{ background: 'white', borderRadius: 14, padding: '14px 16px', border: '1.5px solid #f0e8d8', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <img src={p.image} alt={p.name}
                  style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', background: '#f0e8d8', flexShrink: 0 }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/60/F7EFD8/C9A84C?text=R'; }}
                />
                <div style={{ flex: 1, minWidth: 140 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#888', fontFamily: 'DM Sans, sans-serif' }}>
                    <span style={{ color: '#C0272D', fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</span>
                    {' · '}{p.category}
                    {' · '}
                    <span style={{ color: p.stock > 0 ? '#16a34a' : '#C0272D' }}>Stock: {p.stock}</span>
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {p.featured && <span style={{ fontSize: 10, background: '#fff9e6', color: '#C9A84C', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>Featured</span>}
                  {p.dealOfWeek && <span style={{ fontSize: 10, background: '#fff0f0', color: '#C0272D', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>Deal</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(p)}
                    style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid #C9A84C', background: 'white', color: '#C9A84C', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
                    ✏ Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(p.id)}
                    style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid #fecaca', background: 'white', color: '#C0272D', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders tab */}
      {tab === 'orders' && (
        <div>
          {state.orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1.5px solid #f0e8d8' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
              <p style={{ color: '#888', fontFamily: 'DM Sans, sans-serif' }}>No orders yet. Orders placed via WhatsApp will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {[...state.orders].reverse().map(o => (
                <div key={o.id} style={{ background: 'white', borderRadius: 14, padding: '16px', border: '1.5px solid #f0e8d8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                    <div>
                      <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>{o.productName}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#888', fontFamily: 'DM Sans, sans-serif' }}>
                        {new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#C0272D', fontFamily: 'DM Sans, sans-serif' }}>
                        ₹{o.total?.toLocaleString('en-IN')}
                      </span>
                      <select
                        value={o.status}
                        onChange={e => dispatch({ type: 'UPDATE_ORDER_STATUS', id: o.id, status: e.target.value })}
                        style={{ padding: '5px 10px', borderRadius: 8, border: `1.5px solid ${STATUS_COLORS[o.status] || '#e8e0d0'}`, fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: STATUS_COLORS[o.status], background: 'white', cursor: 'pointer', outline: 'none' }}
                      >
                        {['Pending', 'Confirmed', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 4, fontSize: 12, color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
                    <span>👤 {o.customerName || '—'}</span>
                    <span>📞 {o.customerPhone || '—'}</span>
                    <span>📦 Qty: {o.qty}</span>
                    <span>📍 {o.customerAddress ? o.customerAddress.substring(0, 40) + (o.customerAddress.length > 40 ? '…' : '') : '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product form modal */}
      {showForm && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 16px' }}
        >
          <div style={{ background: 'white', borderRadius: 20, padding: '28px 24px', width: '100%', maxWidth: 520, marginTop: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', margin: 0, fontSize: 18 }}>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888', lineHeight: 1 }}>×</button>
            </div>

            <FormField label="Product Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Royal Gold Kundan Ring" required />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Price (₹)" type="number" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} placeholder="2499" required />
              <FormField label="Original Price (₹)" type="number" value={form.originalPrice} onChange={v => setForm(f => ({ ...f, originalPrice: v }))} placeholder="Blank = no discount" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5, fontFamily: 'DM Sans, sans-serif' }}>Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e8e0d0', fontSize: 13, fontFamily: 'DM Sans, sans-serif', background: 'white', outline: 'none' }}>
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <FormField label="Stock" type="number" value={form.stock} onChange={v => setForm(f => ({ ...f, stock: v }))} placeholder="10" required />
            </div>

            <FormField label="Description" type="textarea" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Describe the product..." />

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5, fontFamily: 'DM Sans, sans-serif' }}>Product Image</label>
              <ImageUploader value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>Tags</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <button key={c.id} onClick={() => toggleTag(c.id)}
                    style={{ padding: '4px 12px', borderRadius: 999, border: `1.5px solid ${form.tags.includes(c.id) ? '#C0272D' : '#e8e0d0'}`, background: form.tags.includes(c.id) ? '#fff0f0' : 'white', color: form.tags.includes(c.id) ? '#C0272D' : '#888', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
              {[['featured', 'Featured Product'], ['dealOfWeek', 'Deal of the Week']].map(([key, lbl]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: '#555', fontWeight: 500 }}>
                  <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                    style={{ accentColor: '#C0272D', width: 15, height: 15 }} />
                  {lbl}
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowForm(false)}
                style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #e8e0d0', background: 'white', cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#888', fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={!form.name || !form.price || !form.stock}
                style={{ flex: 2, padding: '12px', borderRadius: 10, border: 'none', background: (!form.name || !form.price || !form.stock) ? '#ccc' : '#C0272D', color: 'white', cursor: (!form.name || !form.price || !form.stock) ? 'not-allowed' : 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>
                {editProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '28px 24px', maxWidth: 340, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', margin: '0 0 8px' }}>Delete Product?</h3>
            <p style={{ fontSize: 13, color: '#888', fontFamily: 'DM Sans, sans-serif', margin: '0 0 20px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #e8e0d0', background: 'white', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: '#C0272D', color: 'white', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}