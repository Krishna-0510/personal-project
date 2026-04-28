import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const addToCart = async () => {
    try {
      await api.post('/api/cart/add', { productId: id, quantity });
      toast.success('Added to cart! 🛒');
      navigate('/cart');
    } catch {
      toast.error('Could not add to cart');
    }
  };

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <p style={{ color: '#aaa' }}>Loading...</p>
    </div>
  );

  if (!product) return null;

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none', border: 'none', fontSize: 22,
          padding: '16px 0', display: 'block', color: '#333',
        }}
      >
        ← 
      </button>

      {/* Product Image */}
      <div style={{
        background: '#f9f5f0', borderRadius: 16, height: 220,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20, fontSize: 80,
      }}>
        {product.image
          ? <img src={product.image} alt={product.name}
              style={{ height: '100%', objectFit: 'contain', borderRadius: 16 }} />
          : '🛒'}
      </div>

      {/* Product Info */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 4 }}>{product.name}</h2>
            <p style={{ color: '#888', fontSize: 14 }}>{product.unit}</p>
          </div>
          <div style={{
            background: product.inStock ? '#e8f5e9' : '#fce4ec',
            color: product.inStock ? '#2e7d32' : '#c62828',
            borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600,
          }}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0ebe4' }}>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#e65c00' }}>₹{product.price}</p>
        </div>

        {product.description && (
          <p style={{ color: '#555', fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>
            {product.description}
          </p>
        )}
      </div>

      {/* Category */}
      {product.category && (
        <div className="card" style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: '#888' }}>Category</p>
          <p style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>
            {product.category.icon} {product.category.name}
          </p>
        </div>
      )}

      {/* Quantity + Add to Cart */}
      {product.inStock && (
        <div style={{
          position: 'fixed', bottom: 70, left: 0, right: 0,
          maxWidth: 480, margin: '0 auto',
          background: '#fff', borderTop: '1px solid #f0ebe4',
          padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center',
        }}>
          {/* Quantity Selector */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: '#f9f5f0', borderRadius: 10, padding: '8px 14px',
          }}>
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={{
                background: '#fff', border: '1px solid #e0d8d0',
                borderRadius: 6, width: 28, height: 28,
                fontSize: 18, fontWeight: 700, color: '#e65c00',
              }}
            >−</button>
            <span style={{ fontWeight: 700, fontSize: 16, minWidth: 20, textAlign: 'center' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              style={{
                background: '#e65c00', border: 'none',
                borderRadius: 6, width: 28, height: 28,
                fontSize: 18, fontWeight: 700, color: '#fff',
              }}
            >+</button>
          </div>

          <button
            className="btn-primary"
            onClick={addToCart}
            style={{ flex: 1 }}
          >
            Add to Cart — ₹{product.price * quantity}
          </button>
        </div>
      )}
    </div>
  );
}