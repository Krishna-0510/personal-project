import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);

  useScrollReveal();

  const catIcons = ['🌾','🧴','🥛','🧂','🍪','🥤','🧹','🫒'];

  useEffect(() => {
    api.get('/api/products/categories').then(res => {
      setCategories(res.data?.categories || res.data || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (activeCategory !== 'all') params.append('category', activeCategory);
    if (sortBy) params.append('sort', sortBy);
    const delay = setTimeout(() => {
      api.get(`/api/products?${params}`).then(res => {
        setProducts(res.data?.products || res.data || []);
      }).catch(() => toast.error('Failed to load products')).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(delay);
  }, [search, activeCategory, sortBy]);

  const addToCart = async (e, productId) => {
    e.stopPropagation();
    try {
      await api.post('/api/cart/add', { productId, quantity: 1 });
      toast.success('Added to cart!');
    } catch {
      toast.error('Could not add to cart');
    }
  };

  return (
    <div style={{ padding: '40px 80px 60px', minHeight: '100vh' }}>

      {/* Header */}
      <div className="reveal" style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 12, color: '#FF6B2B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Our Store</p>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800 }}>All Products</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32 }}>

        {/* SIDEBAR */}
        <aside className="reveal-left">
          {/* Search */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Search</div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#aaa' }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                style={{
                  width: '100%', background: '#fff',
                  border: '1px solid #EDE8E3', borderRadius: 10,
                  padding: '10px 12px 10px 36px', fontSize: 13, outline: 'none',
                  transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#FF6B2B'}
                onBlur={e => e.target.style.borderColor = '#EDE8E3'}
              />
            </div>
          </div>

          {/* Categories */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Categories</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div
                onClick={() => setActiveCategory('all')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                  background: activeCategory === 'all' ? '#FFF0E8' : 'transparent',
                  color: activeCategory === 'all' ? '#FF6B2B' : '#555',
                  fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (activeCategory !== 'all') e.currentTarget.style.background = '#f9f6f2'; }}
                onMouseLeave={e => { if (activeCategory !== 'all') e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 16 }}>🛒</span>
                <span style={{ flex: 1 }}>All Items</span>
              </div>
              {categories.map((cat, i) => (
                <div key={cat._id}
                  onClick={() => setActiveCategory(cat._id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    background: activeCategory === cat._id ? '#FFF0E8' : 'transparent',
                    color: activeCategory === cat._id ? '#FF6B2B' : '#555',
                    fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (activeCategory !== cat._id) e.currentTarget.style.background = '#f9f6f2'; }}
                  onMouseLeave={e => { if (activeCategory !== cat._id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 16 }}>{cat.icon || catIcons[i % catIcons.length]}</span>
                  <span style={{ flex: 1 }}>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Sort By</div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                width: '100%', background: '#fff', border: '1px solid #EDE8E3',
                borderRadius: 10, padding: '10px 12px', fontSize: 13,
                color: '#555', outline: 'none',
              }}
            >
              <option value="">Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div>
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: '#888' }}>
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, height: 280, border: '1px solid #EDE8E3' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, marginBottom: 8 }}>No products found</h3>
              <p style={{ color: '#aaa' }}>Try a different search or category</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {products.map((product, i) => (
                <div key={product._id} className={`reveal-scale delay-${(i % 3) + 1}`}
                  style={{
                    background: '#fff', borderRadius: 16,
                    border: '1px solid #EDE8E3', overflow: 'hidden',
                    cursor: 'pointer', transition: 'transform 0.25s, box-shadow 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div onClick={() => navigate(`/products/${product._id}`)}>
                    <div style={{
                      background: '#FDF3EE', height: 160,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 60, position: 'relative',
                    }}>
                      {product.image
                        ? <img src={product.image} alt={product.name} style={{ height: '80%', objectFit: 'contain' }} />
                        : catIcons[i % catIcons.length]}
                      <div style={{
                        position: 'absolute', top: 12, left: 12,
                        background: product.inStock ? '#DCFCE7' : '#FEE2E2',
                        color: product.inStock ? '#166534' : '#991B1B',
                        fontSize: 10, fontWeight: 700, borderRadius: 6, padding: '3px 8px',
                      }}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px 12px' }}>
                      <div style={{ fontSize: 11, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                        {product.category?.name || 'Grocery'}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>{product.unit}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700 }}>₹{product.price}</span>
                        {product.inStock && (
                          <button
                            onClick={e => addToCart(e, product._id)}
                            style={{
                              width: 36, height: 36, background: '#FF6B2B',
                              border: 'none', borderRadius: 10, color: '#fff',
                              fontSize: 22, fontWeight: 700, display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              transition: 'background 0.2s, transform 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#e85a1a'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#FF6B2B'; e.currentTarget.style.transform = 'scale(1)'; }}
                          >+</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}