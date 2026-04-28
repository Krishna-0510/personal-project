import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.get('/api/cart').then(res => {
      setCartCount(res.data?.items?.length || 0);
    }).catch(() => {});
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/orders', label: 'My Orders' },
    { path: '/wallet', label: 'Wallet' },
  ];

  return (
    <>
      {/* TOP BAR */}
      <div style={{
        background: '#1C1C1C',
        position: 'sticky', top: 0, zIndex: 1000,
        transition: 'box-shadow 0.3s',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
      }}>
       <div style={{
  padding: '0 80px',
  display: 'flex', alignItems: 'center',
  height: 64, gap: 32,
}}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, background: '#FF6B2B',
              borderRadius: 10, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 18,
            }}>🏪</div>
            <span style={{
              fontFamily: 'Syne, sans-serif', fontSize: 20,
              fontWeight: 800, color: '#fff',
            }}>Krishna <span style={{ color: '#FF6B2B' }}>Kirana</span></span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 500 }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', fontSize: 15, color: '#666',
              }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for rice, dal, oil, soap..."
                style={{
                  width: '100%', background: '#2E2E2E',
                  border: '1px solid #3A3A3A', borderRadius: 10,
                  padding: '10px 16px 10px 42px',
                  color: '#fff', fontSize: 14, outline: 'none',
                  transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#FF6B2B'}
                onBlur={e => e.target.style.borderColor = '#3A3A3A'}
              />
            </div>
          </form>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {navLinks.map(({ path, label }) => (
              <Link key={path} to={path} style={{
                color: location.pathname === path ? '#FF6B2B' : '#aaa',
                fontSize: 14, fontWeight: 500,
                transition: 'color 0.2s',
                borderBottom: location.pathname === path ? '2px solid #FF6B2B' : '2px solid transparent',
                paddingBottom: 2,
              }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = location.pathname === path ? '#FF6B2B' : '#aaa'}
              >{label}</Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
            <Link to="/profile" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: '#aaa', fontSize: 13, fontWeight: 500,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#aaa'; }}
            >
              <div style={{
                width: 32, height: 32, background: '#FF6B2B',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 14, color: '#fff', fontWeight: 700,
              }}>
                {user?.displayName?.[0] || user?.email?.[0] || '?'}
              </div>
              {user?.displayName?.split(' ')[0] || 'Account'}
            </Link>

            <Link to="/cart" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FF6B2B', color: '#fff',
              borderRadius: 10, padding: '9px 18px',
              fontSize: 14, fontWeight: 600, position: 'relative',
              transition: 'background 0.2s, transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e85a1a'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FF6B2B'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              🛒 Cart
              {cartCount > 0 && (
                <span style={{
                  background: '#fff', color: '#FF6B2B',
                  borderRadius: 20, padding: '1px 7px',
                  fontSize: 11, fontWeight: 800,
                }}>{cartCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* SUB NAV */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #EDE8E3',
        }}>
          <div style={{
  padding: '0 80px',
  display: 'flex', alignItems: 'center', gap: 4, height: 44,
}}>
            {['All', 'Grains & Dal', 'Personal Care', 'Dairy & Eggs', 'Spices', 'Snacks', 'Beverages', 'Cleaning'].map((cat, i) => (
              <Link key={cat} to={i === 0 ? '/products' : `/products?search=${cat}`}
                style={{
                  padding: '0 14px', height: 44, display: 'flex', alignItems: 'center',
                  fontSize: 13, fontWeight: 500, color: '#555',
                  borderBottom: '2px solid transparent',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#FF6B2B'; e.currentTarget.style.borderBottomColor = '#FF6B2B'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderBottomColor = 'transparent'; }}
              >{cat}</Link>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888' }}>
              <span style={{ color: '#FF6B2B' }}>📍</span> Bhopal, MP
            </div>
          </div>
        </div>
      </div>
    </>
  );
}