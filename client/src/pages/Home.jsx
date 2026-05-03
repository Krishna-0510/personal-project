import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/api/products/categories'),
          api.get('/api/products?limit=8'),
        ]);
        setCategories(catRes.data?.categories || catRes.data || []);
        setFeatured(prodRes.data?.products || prodRes.data || []);
      } catch {
        toast.error('Failed to load data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const addToCart = async (productId) => {
    try {
      await api.post('/api/cart/add', { productId, quantity: 1 });
      toast.success('Added to cart!');
    } catch {
      toast.error('Could not add to cart');
    }
  };

  const catIcons = ['🌾', '🧴', '🥛', '🧂', '🍪', '🥤', '🧹', '🫒'];

  return (
    <div className="min-h-screen" style={{ background: '#F7F3EE' }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ background: '#1C1C1C', width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          minHeight: 480,
          alignItems: 'stretch',
        }} className="hero-grid">
          {/* Left */}
          <div style={{
            padding: '64px 60px 64px 80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            {/* Tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,107,43,0.15)', color: '#FF8C5A',
              borderRadius: 20, padding: '6px 16px', fontSize: 12,
              fontWeight: 700, marginBottom: 24, alignSelf: 'flex-start',
              letterSpacing: '0.02em',
            }}>
              ⚡ Same Day Delivery in Bhopal
            </div>

            {/* Heading */}
            <h1 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 54, fontWeight: 800, color: '#ffffff',
              lineHeight: 1.1, marginBottom: 20,
            }}>
              Your Neighbourhood<br />
              <span style={{ color: '#FF6B2B' }}>Kirana Store</span><br />
              Gone Digital.
            </h1>

            {/* Subtitle */}
            <p style={{
              color: '#999', fontSize: 16, lineHeight: 1.75,
              marginBottom: 36, maxWidth: 440,
            }}>
              Fresh groceries, daily essentials & household needs —
              delivered to your door in hours. No minimum order.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 48 }}>
              <button
                onClick={() => navigate('/products')}
                style={{
                  background: '#FF6B2B', color: '#fff', border: 'none',
                  borderRadius: 12, padding: '14px 36px', fontSize: 15,
                  fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  transition: 'background 0.2s, transform 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e85a1a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FF6B2B'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Shop Now →
              </button>
              <button
                onClick={() => navigate('/products')}
                style={{
                  background: 'transparent', color: '#ccc',
                  border: '1.5px solid #444', borderRadius: 12,
                  padding: '14px 28px', fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#ccc'; }}
              >
                Browse Offers
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 44 }}>
              {[['500+', 'Products'], ['2hr', 'Fast Delivery'], ['4.9★', 'Rating'], ['Free', 'Delivery']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#fff' }}>{num}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Today's Picks */}
          <div style={{
            background: '#252525', borderLeft: '1px solid #333',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', gap: 12,
            padding: '40px 32px',
          }}>
            <div style={{
              fontSize: 11, color: '#666', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
            }}>
              Today's Picks
            </div>

            {loading && [1, 2, 3].map(i => (
              <div key={i} style={{
                background: '#2E2E2E', borderRadius: 14, height: 82,
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            ))}

            {!loading && featured.slice(0, 3).map((p, i) => (
              <div
                key={p._id}
                onClick={() => navigate(`/products/${p._id}`)}
                style={{
                  background: '#2E2E2E', borderRadius: 14,
                  padding: '14px 16px', display: 'flex',
                  alignItems: 'center', gap: 14, cursor: 'pointer',
                  border: '1px solid #3A3A3A',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B2B'; e.currentTarget.style.background = '#333'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#3A3A3A'; e.currentTarget.style.background = '#2E2E2E'; }}
              >
                <div style={{
                  width: 52, height: 52, background: '#3A3A3A',
                  borderRadius: 10, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 24, flexShrink: 0,
                }}>{catIcons[i] || '🛒'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{p.unit}</div>
                </div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700, color: '#FF6B2B', flexShrink: 0 }}>₹{p.price}</div>
                <button
                  onClick={e => { e.stopPropagation(); addToCart(p._id); }}
                  style={{
                    width: 30, height: 30, background: '#FF6B2B',
                    border: 'none', borderRadius: 8, color: '#fff',
                    fontSize: 20, fontWeight: 700, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e85a1a'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FF6B2B'}
                >+</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFERS STRIP ─────────────────────────────── */}
      <section style={{ background: '#FF6B2B', padding: '14px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          {[['🚚', 'Free delivery on all orders'], ['⚡', 'Delivery in 2 hours'], ['💳', 'COD & UPI accepted'], ['🔄', 'Easy returns']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 80px' }}>

        {/* ── CATEGORIES ───────────────────────────────── */}
        <section style={{ paddingTop: 56, paddingBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 12, color: '#FF6B2B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Browse by</p>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#1C1C1C' }}>Shop Categories</h2>
            </div>
            <button
              onClick={() => navigate('/products')}
              style={{
                background: 'none', border: '1px solid #EDE8E3', borderRadius: 10,
                padding: '9px 22px', fontSize: 13, fontWeight: 600, color: '#555',
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FF6B2B'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#FF6B2B'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#EDE8E3'; }}
            >View All →</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 14 }}>
            {(categories.length > 0 ? categories : Array(8).fill(null)).map((cat, i) => (
              <div
                key={i}
                onClick={() => navigate(cat ? `/products?category=${cat._id}` : '/products')}
                style={{
                  background: '#fff', borderRadius: 16, padding: '20px 10px',
                  textAlign: 'center', cursor: 'pointer',
                  border: '1px solid #EDE8E3', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#FFF0E8';
                  e.currentTarget.style.borderColor = '#FF6B2B';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,107,43,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#EDE8E3';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: 30, marginBottom: 10 }}>
                  {cat ? (cat.icon || catIcons[i] || '🛍️') : catIcons[i]}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#333', lineHeight: 1.3 }}>
                  {cat ? cat.name : (
                    <span style={{ background: '#F0EBE5', borderRadius: 4, color: '#F0EBE5', userSelect: 'none' }}>----</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ─────────────────────────── */}
        <section style={{ paddingTop: 16, paddingBottom: 56 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 12, color: '#FF6B2B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Hand picked</p>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#1C1C1C' }}>Featured Products</h2>
            </div>
            <button
              onClick={() => navigate('/products')}
              style={{
                background: 'none', border: '1px solid #EDE8E3', borderRadius: 10,
                padding: '9px 22px', fontSize: 13, fontWeight: 600, color: '#555',
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FF6B2B'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#FF6B2B'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#EDE8E3'; }}
            >See All Products →</button>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, height: 290, border: '1px solid #EDE8E3' }} />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <p style={{ fontSize: 16 }}>No products yet. Add some from admin!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {featured.map((product, i) => (
                <div
                  key={product._id}
                  style={{
                    background: '#fff', borderRadius: 16,
                    border: '1px solid #EDE8E3', overflow: 'hidden',
                    cursor: 'pointer', transition: 'transform 0.25s, box-shadow 0.25s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div onClick={() => navigate(`/products/${product._id}`)}>
                    {/* Image */}
                    <div style={{
                      background: '#FDF3EE', height: 160,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 56,
                      position: 'relative',
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

                    {/* Info */}
                    <div style={{ padding: '14px 16px 12px' }}>
                      <div style={{ fontSize: 11, color: '#bbb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                        {product.category?.name || 'Grocery'}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1C1C1C', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#aaa', marginBottom: 14 }}>{product.unit}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: '#1C1C1C' }}>
                          ₹{product.price}
                        </span>
                        {product.inStock && (
                          <button
                            onClick={e => { e.stopPropagation(); addToCart(product._id); }}
                            style={{
                              width: 36, height: 36, background: '#FF6B2B',
                              border: 'none', borderRadius: 10, color: '#fff',
                              fontSize: 22, fontWeight: 700, display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', transition: 'background 0.2s, transform 0.15s',
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
        </section>

        {/* ── WHY US ───────────────────────────────────── */}
        <section style={{ paddingTop: 40, paddingBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 12, color: '#FF6B2B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Why choose us</p>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#1C1C1C' }}>The Krishna Kirana Promise</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { icon: '🚚', title: 'Fast Delivery', desc: 'Order before 6 PM and get delivered same day to your doorstep.' },
              { icon: '✅', title: 'Quality Assured', desc: 'Every product is handpicked and quality checked before dispatch.' },
              { icon: '💰', title: 'Best Prices', desc: 'Genuine kirana prices — no hidden charges, no markups.' },
              { icon: '📞', title: 'WhatsApp Support', desc: 'Track and manage your order directly via WhatsApp.' },
            ].map(({ icon, title, desc }, i) => (
              <div
                key={title}
                style={{
                  background: '#fff', borderRadius: 16,
                  border: '1px solid #EDE8E3', padding: '28px 24px',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6B2B'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,107,43,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDE8E3'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 52, height: 52, background: '#FFF0E8',
                  borderRadius: 14, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 26, marginBottom: 16,
                }}>{icon}</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700, marginBottom: 8, color: '#1C1C1C' }}>{title}</h3>
                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ───────────────────────────────── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{
            background: '#1C1C1C', borderRadius: 24,
            padding: '52px 60px', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center', gap: 32,
          }}>
            <div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
                Ready to order your groceries?
              </h2>
              <p style={{ color: '#777', fontSize: 15 }}>Free delivery · No minimum order · Pay on delivery</p>
            </div>
            <button
              onClick={() => navigate('/products')}
              style={{
                background: '#FF6B2B', color: '#fff', border: 'none',
                borderRadius: 12, padding: '16px 44px', fontSize: 16,
                fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                fontFamily: 'DM Sans, sans-serif', transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e85a1a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF6B2B'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start Shopping →
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}