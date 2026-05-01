import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const { state } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [sortBy, setSortBy] = useState('default');
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const maxProductPrice = Math.max(...state.products.map(p => p.price), 500);

  const filtered = useMemo(() => {
    let list = [...state.products];
    if (selectedCategory !== 'all') {
      list = list.filter(p =>
        p.category === selectedCategory || (p.tags && p.tags.includes(selectedCategory))
      );
    }
    list = list.filter(p => p.price <= maxPrice);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [state.products, selectedCategory, maxPrice, sortBy, search]);

  const FilterContent = () => (
    <div>
      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', letterSpacing: 1.5, display: 'block', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>SEARCH</label>
        <input
          type="text"
          placeholder="Search jewellery..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e8e0d0', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Categories */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', letterSpacing: 1.5, display: 'block', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>CATEGORY</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchParams(cat.id !== 'all' ? { category: cat.id } : {});
              }}
              style={{
                padding: '9px 14px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                background: selectedCategory === cat.id ? '#C0272D' : 'transparent',
                color: selectedCategory === cat.id ? 'white' : '#555',
                fontWeight: selectedCategory === cat.id ? 600 : 400,
                fontSize: 13,
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.15s',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C', letterSpacing: 1.5, display: 'block', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>PRICE RANGE</label>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#888', fontFamily: 'DM Sans, sans-serif' }}>₹0</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#C0272D', fontFamily: 'DM Sans, sans-serif' }}>
            up to ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={maxProductPrice}
          step={500}
          value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 11, color: '#bbb', fontFamily: 'DM Sans, sans-serif' }}>₹500</span>
          <span style={{ fontSize: 11, color: '#bbb', fontFamily: 'DM Sans, sans-serif' }}>₹{maxProductPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          setSelectedCategory('all');
          setMaxPrice(15000);
          setSortBy('default');
          setSearch('');
          setSearchParams({});
        }}
        style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1.5px solid #e8e0d0', background: 'white', cursor: 'pointer', fontSize: 13, color: '#888', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', margin: '0 0 4px', color: '#1a1a1a' }}>
            Our <span style={{ color: '#C0272D' }}>Collection</span>
          </h1>
          <p style={{ margin: 0, color: '#888', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="mobile-filter-btn"
            style={{ padding: '9px 16px', borderRadius: 10, border: '1.5px solid #e8e0d0', background: filterOpen ? '#C0272D' : 'white', color: filterOpen ? 'white' : '#444', cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif', fontWeight: 500, display: 'none' }}
          >
            ⚙ Filters
          </button>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: 10, border: '1.5px solid #e8e0d0', fontSize: 13, fontFamily: 'DM Sans, sans-serif', background: 'white', color: '#444', cursor: 'pointer', outline: 'none' }}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>

      {/* Mobile filter panel */}
      {filterOpen && (
        <div className="mobile-filter-panel" style={{ background: 'white', borderRadius: 16, padding: 20, marginBottom: 20, border: '1.5px solid #f0e8d8', display: 'none' }}>
          <FilterContent />
        </div>
      )}

      <div style={{ display: 'grid', gap: 28 }} className="products-layout">
        {/* Sidebar */}
        <aside className="products-sidebar" style={{ background: 'white', borderRadius: 16, padding: '24px 20px', border: '1.5px solid #f0e8d8', height: 'fit-content', position: 'sticky', top: 80 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 20px', fontFamily: 'Playfair Display, serif' }}>Filters</h3>
          <FilterContent />
        </aside>

        {/* Grid */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💎</div>
              <h3 style={{ color: '#888', fontFamily: 'Playfair Display, serif' }}>No products found</h3>
              <p style={{ color: '#aaa', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .products-layout { grid-template-columns: 240px 1fr; }
        @media (max-width: 768px) {
          .products-layout { grid-template-columns: 1fr !important; }
          .products-sidebar { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
          .mobile-filter-panel { display: block !important; }
        }
      `}</style>
    </div>
  );
}