import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';

const MAX_IMAGES = 5;

const EMPTY_FORM = {
  name: '', price: '', originalPrice: '', category: 'rings',
  tags: [], description: '', images: [], stock: '', featured: false, dealOfWeek: false,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function getMonthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function getMonthLabel(key) {
  const [y, m] = key.split('-');
  return new Date(y, m - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
}
function pct(a, b) {
  if (!b) return null;
  return Math.round(((a - b) / b) * 100);
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Trend({ value }) {
  if (value === null) return null;
  const up = value >= 0;
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
      color: up ? '#16a34a' : '#C0272D',
      background: up ? '#f0fdf4' : '#fff0f0',
      padding: '2px 7px', borderRadius: 999,
      display: 'inline-flex', alignItems: 'center', gap: 2,
    }}>
      {up ? '↑' : '↓'} {Math.abs(value)}%
    </span>
  );
}

function MiniBarChart({ data, color = '#C0272D' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 64 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
            <div title={`${d.label}: ${d.value}`}
              style={{
                width: '100%', borderRadius: '4px 4px 0 0',
                background: i === data.length - 1 ? color : `${color}55`,
                height: `${Math.max((d.value / max) * 100, 4)}%`,
                transition: 'height 0.4s ease',
              }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: '#bbb', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ segments, size = 90 }) {
  const total = segments.reduce((s, sg) => s + sg.value, 0);
  if (!total) return <div style={{ width: size, height: size, borderRadius: '50%', background: '#f0e8d8' }} />;
  const r = 40, circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      {segments.map((sg, i) => {
        const dash = (sg.value / total) * circumference;
        const el = (
          <circle key={i} cx={50} cy={50} r={r}
            fill="none" stroke={sg.color} strokeWidth="18"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-(offset / total) * circumference}
          />
        );
        offset += sg.value;
        return el;
      })}
      <circle cx={50} cy={50} r="28" fill="white" />
    </svg>
  );
}

function InsightCard({ icon, title, value, sub, trend, color = '#C0272D' }) {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: '18px 20px', border: '1.5px solid #f0e8d8', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 22 }}>{icon}</div>
        {trend !== undefined && <Trend value={trend} />}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color, fontFamily: 'DM Sans, sans-serif', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#333', fontFamily: 'DM Sans, sans-serif' }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: '#aaa', fontFamily: 'DM Sans, sans-serif' }}>{sub}</div>}
    </div>
  );
}

// ─── Multi-image uploader ────────────────────────────────────────────────────

function MultiImageUploader({ images, onChange }) {
  const fileRef = useRef();
  const [urlInput, setUrlInput] = useState('');
  const [tab, setTab] = useState('url');

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed || images.length >= MAX_IMAGES) return;
    onChange([...images, trimmed]);
    setUrlInput('');
  };

  const handleFile = e => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining);
    let loaded = [], count = 0;
    if (!toAdd.length) return;
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        loaded.push(ev.target.result);
        count++;
        if (count === toAdd.length) onChange([...images, ...loaded]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = idx => onChange(images.filter((_, i) => i !== idx));
  const moveImage = (idx, dir) => {
    const next = idx + dir;
    if (next < 0 || next >= images.length) return;
    const arr = [...images];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    onChange(arr);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: '#aaa', fontFamily: 'DM Sans, sans-serif' }}>
          {images.length}/{MAX_IMAGES} images · First image is the cover
        </span>
      </div>
      {images.length < MAX_IMAGES && (
        <>
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1.5px solid #e8e0d0', marginBottom: 8 }}>
            {['url', 'upload'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, padding: '8px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', background: tab === t ? '#C0272D' : 'white', color: tab === t ? 'white' : '#555', transition: 'all 0.15s' }}>
                {t === 'url' ? '🔗 Image URL' : '📁 Upload File'}
              </button>
            ))}
          </div>
          {tab === 'url' ? (
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addUrl()}
                placeholder="https://example.com/image.jpg"
                style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e8e0d0', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
              <button onClick={addUrl} disabled={!urlInput.trim()}
                style={{ padding: '9px 14px', borderRadius: 8, background: urlInput.trim() ? '#C9A84C' : '#e8e0d0', color: 'white', border: 'none', cursor: urlInput.trim() ? 'pointer' : 'not-allowed', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>
                Add
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: 10 }}>
              <input type="file" accept="image/*" multiple ref={fileRef} onChange={handleFile} style={{ display: 'none' }} />
              <button onClick={() => fileRef.current.click()}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px dashed #C9A84C', background: '#fdf9f3', cursor: 'pointer', fontSize: 13, color: '#C9A84C', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
                Click to select up to {MAX_IMAGES - images.length} image{MAX_IMAGES - images.length !== 1 ? 's' : ''}
              </button>
            </div>
          )}
        </>
      )}
      {images.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
              <img src={img} alt={`preview ${i + 1}`}
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: i === 0 ? '2.5px solid #C0272D' : '1.5px solid #e8e0d0', display: 'block' }}
                onError={e => { e.target.style.opacity = 0.3; }} />
              {i === 0 && (
                <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(192,39,45,0.85)', color: 'white', fontSize: 9, fontWeight: 700, textAlign: 'center', fontFamily: 'DM Sans, sans-serif', padding: '2px 0', borderRadius: '0 0 6px 6px' }}>
                  COVER
                </span>
              )}
              <button onClick={() => removeImage(i)}
                style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#C0272D', color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, zIndex: 1 }}>×</button>
              {images.length > 1 && (
                <div style={{ position: 'absolute', top: -6, left: -6, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {i > 0 && <button onClick={() => moveImage(i, -1)} title="Move left"
                    style={{ width: 18, height: 18, borderRadius: '50%', background: '#C9A84C', color: 'white', border: 'none', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>}
                  {i < images.length - 1 && <button onClick={() => moveImage(i, 1)} title="Move right"
                    style={{ width: 18, height: 18, borderRadius: '50%', background: '#C9A84C', color: 'white', border: 'none', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {images.length === 0 && <p style={{ fontSize: 12, color: '#bbb', fontFamily: 'DM Sans, sans-serif', margin: '4px 0 0' }}>No images added yet.</p>}
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
const CAT_COLORS = ['#C0272D', '#C9A84C', '#3b82f6', '#16a34a', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'];

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [savedMsg, setSavedMsg] = useState('');

  // ── Analytics ─────────────────────────────────────────────────────────────
  const analytics = useMemo(() => {
    const orders = state.orders;
    const activeOrders = orders.filter(o => o.status !== 'Cancelled');

    // Last 6 months keys
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });

    const revenueByMonth = Object.fromEntries(months.map(m => [m, 0]));
    const ordersByMonth = Object.fromEntries(months.map(m => [m, 0]));

    activeOrders.forEach(o => {
      const mk = getMonthKey(o.date);
      if (mk in revenueByMonth) {
        revenueByMonth[mk] += o.total || 0;
        ordersByMonth[mk] += 1;
      }
    });

    const revenueChartData = months.map(m => ({ label: getMonthLabel(m), value: revenueByMonth[m] }));
    const ordersChartData = months.map(m => ({ label: getMonthLabel(m), value: ordersByMonth[m] }));

    const curMonth = months[5], prevMonth = months[4];
    const curRev = revenueByMonth[curMonth], prevRev = revenueByMonth[prevMonth];
    const curOrd = ordersByMonth[curMonth], prevOrd = ordersByMonth[prevMonth];
    const revTrend = pct(curRev, prevRev);
    const ordTrend = pct(curOrd, prevOrd);
    const totalRevenue = activeOrders.reduce((s, o) => s + (o.total || 0), 0);
    const avgOrder = activeOrders.length ? Math.round(totalRevenue / activeOrders.length) : 0;

    // Product performance
    const productSales = {}, productRevenue = {};
    activeOrders.forEach(o => {
      productSales[o.productId] = (productSales[o.productId] || 0) + (o.qty || 1);
      productRevenue[o.productId] = (productRevenue[o.productId] || 0) + (o.total || 0);
    });

    const topBySales = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([pid, qty]) => ({ name: state.products.find(x => x.id === pid)?.name || 'Deleted product', qty, revenue: productRevenue[pid] || 0 }));

    const topByRevenue = Object.entries(productRevenue)
      .sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([pid, rev]) => ({ name: state.products.find(x => x.id === pid)?.name || 'Deleted product', revenue: rev, qty: productSales[pid] || 0 }));

    // Category breakdown
    const catRevenue = {};
    activeOrders.forEach(o => {
      const cat = state.products.find(x => x.id === o.productId)?.category || 'other';
      catRevenue[cat] = (catRevenue[cat] || 0) + (o.total || 0);
    });
    const catSegments = Object.entries(catRevenue)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, val], i) => ({ label: cat, value: val, color: CAT_COLORS[i % CAT_COLORS.length] }));

    // Status counts
    const statusCount = { Pending: 0, Confirmed: 0, Delivered: 0, Cancelled: 0 };
    orders.forEach(o => { statusCount[o.status] = (statusCount[o.status] || 0) + 1; });

    const lowStock = state.products.filter(p => p.stock > 0 && p.stock <= 3);
    const outOfStock = state.products.filter(p => p.stock === 0);

    // Insight strings
    const insights = [];
    if (revTrend !== null) {
      if (revTrend > 0) insights.push(`📈 Revenue is up ${revTrend}% this month compared to last — great momentum! Keep promoting your top products.`);
      else if (revTrend < 0) insights.push(`📉 Revenue dipped ${Math.abs(revTrend)}% this month vs last. Consider running a discount or Deal of the Week to boost sales.`);
      else insights.push(`📊 Revenue is flat compared to last month. Try featuring new arrivals or promotions to spark interest.`);
    }
    if (ordTrend !== null) {
      if (ordTrend > 0) insights.push(`🛍️ Orders are up ${ordTrend}% this month — more customers are buying. Make sure stock levels are healthy.`);
      else if (ordTrend < 0) insights.push(`🛍️ Fewer orders this month (${Math.abs(ordTrend)}% drop). Try sharing product links more on WhatsApp or social media.`);
    }
    if (topBySales[0]) insights.push(`🏆 Best-selling product: "${topBySales[0].name}" with ${topBySales[0].qty} unit${topBySales[0].qty !== 1 ? 's' : ''} sold. Consider keeping it always in stock.`);
    if (topByRevenue[0] && topByRevenue[0].name !== topBySales[0]?.name) insights.push(`💰 Highest revenue product: "${topByRevenue[0].name}" at ₹${topByRevenue[0].revenue.toLocaleString('en-IN')} — even though it may sell fewer units, it earns the most.`);
    if (lowStock.length) insights.push(`⚠️ ${lowStock.length} product${lowStock.length > 1 ? 's are' : ' is'} almost out of stock (3 or fewer left): ${lowStock.map(p => p.name).join(', ')}. Restock soon to avoid missing sales.`);
    if (outOfStock.length) insights.push(`🚫 ${outOfStock.length} product${outOfStock.length > 1 ? 's are' : ' is'} out of stock and invisible to customers. Restock or remove them.`);
    if (statusCount.Pending > 0) insights.push(`⏳ You have ${statusCount.Pending} pending order${statusCount.Pending > 1 ? 's' : ''} waiting for confirmation. Reply to those customers on WhatsApp soon.`);
    if (orders.length === 0) insights.push(`🚀 No orders yet! Share your product links on WhatsApp and social media to get your first sale.`);

    return {
      totalRevenue, curRev, prevRev, revTrend, curOrd, prevOrd, ordTrend,
      revenueChartData, ordersChartData, topBySales, topByRevenue,
      catSegments, statusCount, lowStock, outOfStock, avgOrder,
      totalOrders: orders.length, activeOrders: activeOrders.length, insights,
    };
  }, [state.orders, state.products]);

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
    const images = p.images?.length > 0 ? p.images : p.image ? [p.image] : [];
    setForm({ ...p, price: String(p.price), originalPrice: String(p.originalPrice || ''), stock: String(p.stock), tags: p.tags || [], images });
    setShowForm(true);
  };
  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) return;
    const product = { ...form, id: editProduct ? editProduct.id : Date.now().toString(), price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : null, stock: Number(form.stock), images: form.images, image: form.images[0] || '' };
    dispatch({ type: editProduct ? 'UPDATE_PRODUCT' : 'ADD_PRODUCT', product });
    setShowForm(false);
    setSavedMsg(editProduct ? 'Product updated!' : 'Product added!');
    setTimeout(() => setSavedMsg(''), 3000);
  };
  const handleDelete = id => { dispatch({ type: 'DELETE_PRODUCT', id }); setDeleteConfirm(null); };
  const toggleTag = tag => setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));

  const TABS = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'products', label: `💎 Products (${state.products.length})` },
    { id: 'orders', label: `📦 Orders (${state.orders.length})` },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', margin: '0 0 4px', color: '#1a1a1a' }}>
            Admin <span style={{ color: '#C0272D' }}>Dashboard</span>
          </h1>
          <p style={{ margin: 0, color: '#888', fontSize: 13 }}>Ratiraj Jewels — Store Management</p>
        </div>
        <button onClick={() => { dispatch({ type: 'LOGOUT_ADMIN' }); navigate('/'); }}
          style={{ padding: '9px 16px', borderRadius: 10, border: '1.5px solid #e8e0d0', background: 'white', cursor: 'pointer', fontSize: 13, color: '#888', fontWeight: 500 }}>
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#f0e8d8', borderRadius: 14, padding: 4, width: 'fit-content', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '9px 18px', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, background: tab === t.id ? 'white' : 'transparent', color: tab === t.id ? '#C0272D' : '#888', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {savedMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
          ✅ {savedMsg}
        </div>
      )}

      {/* ════ OVERVIEW TAB ════ */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* KPI cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 14 }}>
            <InsightCard icon="💰" title="Total Revenue" value={`₹${analytics.totalRevenue.toLocaleString('en-IN')}`} sub="All time, excl. cancelled" color="#C0272D" />
            <InsightCard icon="📦" title="Total Orders" value={analytics.totalOrders} sub={`${analytics.activeOrders} active`} color="#3b82f6" />
            <InsightCard icon="🧾" title="Avg Order Value" value={`₹${analytics.avgOrder.toLocaleString('en-IN')}`} sub="Excl. cancelled orders" color="#C9A84C" />
            <InsightCard icon="💎" title="Products Listed" value={state.products.length} sub={`${analytics.outOfStock.length} out of stock`} color="#8b5cf6" />
            <InsightCard icon="📅" title="This Month" value={`₹${analytics.curRev.toLocaleString('en-IN')}`} trend={analytics.revTrend} sub="Revenue vs last month" color="#16a34a" />
            <InsightCard icon="🛍️" title="This Month Orders" value={analytics.curOrd} trend={analytics.ordTrend} sub="vs last month" color="#f59e0b" />
          </div>

          {/* Insights */}
          {analytics.insights.length > 0 && (
            <div style={{ background: 'linear-gradient(135deg, #fffaf5 0%, #fff5f5 100%)', borderRadius: 16, padding: '20px 24px', border: '1.5px solid #f0e8d8' }}>
              <h3 style={{ margin: '0 0 14px', fontFamily: 'Playfair Display, serif', fontSize: 16, color: '#1a1a1a' }}>
                🔍 Insights & Alerts
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {analytics.insights.map((ins, i) => (
                  <div key={i} style={{ fontSize: 13, color: '#444', lineHeight: 1.65, padding: '10px 14px', background: 'white', borderRadius: 10, border: '1px solid #f0e8d8' }}>
                    {ins}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>

            {/* Revenue bar chart */}
            <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1.5px solid #f0e8d8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Monthly Revenue</h4>
                {analytics.revTrend !== null && <Trend value={analytics.revTrend} />}
              </div>
              <p style={{ margin: '0 0 16px', fontSize: 11, color: '#aaa' }}>Last 6 months · excl. cancelled</p>
              <MiniBarChart data={analytics.revenueChartData} color="#C0272D" />
              <div style={{ marginTop: 12, fontSize: 12, color: '#888', borderTop: '1px solid #f5f5f5', paddingTop: 10 }}>
                This month: <strong style={{ color: '#C0272D' }}>₹{analytics.curRev.toLocaleString('en-IN')}</strong>
                {analytics.prevRev > 0 && <span style={{ color: '#aaa' }}> · Last: ₹{analytics.prevRev.toLocaleString('en-IN')}</span>}
              </div>
            </div>

            {/* Orders bar chart */}
            <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1.5px solid #f0e8d8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Monthly Orders</h4>
                {analytics.ordTrend !== null && <Trend value={analytics.ordTrend} />}
              </div>
              <p style={{ margin: '0 0 16px', fontSize: 11, color: '#aaa' }}>Last 6 months · all statuses</p>
              <MiniBarChart data={analytics.ordersChartData} color="#3b82f6" />
              <div style={{ marginTop: 12, fontSize: 12, color: '#888', borderTop: '1px solid #f5f5f5', paddingTop: 10 }}>
                This month: <strong style={{ color: '#3b82f6' }}>{analytics.curOrd} orders</strong>
                {analytics.prevOrd > 0 && <span style={{ color: '#aaa' }}> · Last: {analytics.prevOrd}</span>}
              </div>
            </div>

            {/* Order status donut */}
            <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1.5px solid #f0e8d8' }}>
              <h4 style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Order Status</h4>
              <p style={{ margin: '0 0 16px', fontSize: 11, color: '#aaa' }}>Breakdown of all orders</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <DonutChart size={90} segments={Object.entries(analytics.statusCount).filter(([, v]) => v > 0).map(([k, v]) => ({ label: k, value: v, color: STATUS_COLORS[k] }))} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  {Object.entries(analytics.statusCount).map(([status, count]) => (
                    <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: STATUS_COLORS[status], flexShrink: 0 }} />
                      <span style={{ color: '#555' }}>{status}</span>
                      <span style={{ fontWeight: 700, color: '#1a1a1a', marginLeft: 'auto' }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category donut */}
            {analytics.catSegments.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1.5px solid #f0e8d8' }}>
                <h4 style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Revenue by Category</h4>
                <p style={{ margin: '0 0 16px', fontSize: 11, color: '#aaa' }}>Which category earns the most</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <DonutChart size={90} segments={analytics.catSegments} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minWidth: 0 }}>
                    {analytics.catSegments.map((sg, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: sg.color, flexShrink: 0 }} />
                        <span style={{ color: '#555', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sg.label}</span>
                        <span style={{ fontWeight: 700, color: '#1a1a1a', marginLeft: 'auto', paddingLeft: 6, fontSize: 11, flexShrink: 0 }}>₹{sg.value.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top products + stock */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>

            {/* Most sold */}
            <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1.5px solid #f0e8d8' }}>
              <h4 style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>🏆 Most Sold Products</h4>
              <p style={{ margin: '0 0 16px', fontSize: 11, color: '#aaa' }}>Ranked by units sold (excl. cancelled)</p>
              {analytics.topBySales.length === 0
                ? <p style={{ fontSize: 13, color: '#ccc' }}>No sales data yet.</p>
                : analytics.topBySales.map((p, i) => {
                    const maxQty = analytics.topBySales[0].qty;
                    return (
                      <div key={i} style={{ marginBottom: 13 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 12, color: '#444', fontWeight: i === 0 ? 700 : 500, maxWidth: '72%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {['🥇','🥈','🥉'][i] || `${i+1}.`} {p.name}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#C0272D', flexShrink: 0 }}>{p.qty} sold</span>
                        </div>
                        <div style={{ height: 5, background: '#f5f0ea', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(p.qty / maxQty) * 100}%`, background: i === 0 ? '#C0272D' : '#e8b0b0', borderRadius: 999 }} />
                        </div>
                      </div>
                    );
                  })}
            </div>

            {/* Top revenue */}
            <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1.5px solid #f0e8d8' }}>
              <h4 style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>💰 Top Revenue Products</h4>
              <p style={{ margin: '0 0 16px', fontSize: 11, color: '#aaa' }}>Ranked by total revenue generated</p>
              {analytics.topByRevenue.length === 0
                ? <p style={{ fontSize: 13, color: '#ccc' }}>No sales data yet.</p>
                : analytics.topByRevenue.map((p, i) => {
                    const maxRev = analytics.topByRevenue[0].revenue;
                    return (
                      <div key={i} style={{ marginBottom: 13 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 12, color: '#444', fontWeight: i === 0 ? 700 : 500, maxWidth: '62%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {['🥇','🥈','🥉'][i] || `${i+1}.`} {p.name}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#C9A84C', flexShrink: 0 }}>₹{p.revenue.toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ height: 5, background: '#f5f0ea', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(p.revenue / maxRev) * 100}%`, background: i === 0 ? '#C9A84C' : '#e8d88a', borderRadius: 999 }} />
                        </div>
                      </div>
                    );
                  })}
            </div>

            {/* Stock health */}
            <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1.5px solid #f0e8d8' }}>
              <h4 style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>📦 Stock Health</h4>
              <p style={{ margin: '0 0 16px', fontSize: 11, color: '#aaa' }}>Products needing your attention</p>
              {analytics.outOfStock.length === 0 && analytics.lowStock.length === 0
                ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#16a34a', background: '#f0fdf4', borderRadius: 10, padding: '10px 14px' }}>✅ All products are well-stocked!</div>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {analytics.outOfStock.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fff5f5', borderRadius: 8, border: '1px solid #fecaca' }}>
                        <span style={{ fontSize: 12, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{p.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#C0272D', background: '#fecaca', padding: '2px 8px', borderRadius: 999, flexShrink: 0 }}>Out of stock</span>
                      </div>
                    ))}
                    {analytics.lowStock.map(p => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a' }}>
                        <span style={{ fontSize: 12, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{p.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#d97706', background: '#fde68a', padding: '2px 8px', borderRadius: 999, flexShrink: 0 }}>{p.stock} left</span>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        </div>
      )}

      {/* ════ PRODUCTS TAB ════ */}
      {tab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button onClick={openAdd} className="btn-primary" style={{ fontSize: 13, padding: '9px 18px' }}>+ Add New Product</button>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {state.products.map(p => (
              <div key={p.id} style={{ background: 'white', borderRadius: 14, padding: '14px 16px', border: '1.5px solid #f0e8d8', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <img src={p.image || p.images?.[0] || ''} alt={p.name}
                  style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', background: '#f0e8d8', flexShrink: 0 }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/60/F7EFD8/C9A84C?text=R'; }} />
                <div style={{ flex: 1, minWidth: 140 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 14 }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#888' }}>
                    <span style={{ color: '#C0272D', fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</span>
                    {' · '}{p.category}
                    {' · '}<span style={{ color: p.stock > 0 ? '#16a34a' : '#C0272D' }}>Stock: {p.stock}</span>
                    {p.images?.length > 1 && <span style={{ color: '#C9A84C' }}>{' · '}{p.images.length} photos</span>}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {p.featured && <span style={{ fontSize: 10, background: '#fff9e6', color: '#C9A84C', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>Featured</span>}
                  {p.dealOfWeek && <span style={{ fontSize: 10, background: '#fff0f0', color: '#C0272D', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>Deal</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(p)} style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid #C9A84C', background: 'white', color: '#C9A84C', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✏ Edit</button>
                  <button onClick={() => setDeleteConfirm(p.id)} style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid #fecaca', background: 'white', color: '#C0272D', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════ ORDERS TAB ════ */}
      {tab === 'orders' && (
        <div>
          {state.orders.length === 0
            ? <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1.5px solid #f0e8d8' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                <p style={{ color: '#888' }}>No orders yet. Orders placed via WhatsApp will appear here.</p>
              </div>
            : <div style={{ display: 'grid', gap: 10 }}>
                {[...state.orders].reverse().map(o => (
                  <div key={o.id} style={{ background: 'white', borderRadius: 14, padding: '16px', border: '1.5px solid #f0e8d8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                      <div>
                        <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 14 }}>{o.productName}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#888' }}>{new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#C0272D' }}>₹{o.total?.toLocaleString('en-IN')}</span>
                        <select value={o.status} onChange={e => dispatch({ type: 'UPDATE_ORDER_STATUS', id: o.id, status: e.target.value })}
                          style={{ padding: '5px 10px', borderRadius: 8, border: `1.5px solid ${STATUS_COLORS[o.status] || '#e8e0d0'}`, fontSize: 12, fontWeight: 600, color: STATUS_COLORS[o.status], background: 'white', cursor: 'pointer', outline: 'none' }}>
                          {['Pending', 'Confirmed', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 4, fontSize: 12, color: '#666' }}>
                      <span>👤 {o.customerName || '—'}</span>
                      <span>📞 {o.customerPhone || '—'}</span>
                      <span>📦 Qty: {o.qty}</span>
                      <span>📍 {o.customerAddress ? o.customerAddress.substring(0, 40) + (o.customerAddress.length > 40 ? '…' : '') : '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {/* ── Product form modal ── */}
      {showForm && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 16px' }}>
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
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5, fontFamily: 'DM Sans, sans-serif' }}>Product Images (up to {MAX_IMAGES})</label>
              <MultiImageUploader images={form.images} onChange={imgs => setForm(f => ({ ...f, images: imgs }))} />
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
                  <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} style={{ accentColor: '#C0272D', width: 15, height: 15 }} />
                  {lbl}
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #e8e0d0', background: 'white', cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#888', fontWeight: 500 }}>Cancel</button>
              <button onClick={handleSave} disabled={!form.name || !form.price || !form.stock}
                style={{ flex: 2, padding: '12px', borderRadius: 10, border: 'none', background: (!form.name || !form.price || !form.stock) ? '#ccc' : '#C0272D', color: 'white', cursor: (!form.name || !form.price || !form.stock) ? 'not-allowed' : 'pointer', fontSize: 14, fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>
                {editProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '28px 24px', maxWidth: 340, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', margin: '0 0 8px' }}>Delete Product?</h3>
            <p style={{ fontSize: 13, color: '#888', fontFamily: 'DM Sans, sans-serif', margin: '0 0 20px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #e8e0d0', background: 'white', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: '#C0272D', color: 'white', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}