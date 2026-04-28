import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await api.get('/api/cart');
      setCart(res.data);
    } catch {
      toast.error('Could not load cart');
    }
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    try {
      await api.put('/api/cart/update', { productId, quantity });
      fetchCart();
    } catch {
      toast.error('Could not update');
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/api/cart/remove/${productId}`);
      toast.success('Item removed');
      fetchCart();
    } catch {
      toast.error('Could not remove item');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/api/cart/clear');
      toast.success('Cart cleared');
      fetchCart();
    } catch {
      toast.error('Could not clear cart');
    }
  };

  const total = cart?.items?.reduce((sum, item) =>
    sum + (item.product?.price || 0) * item.quantity, 0) || 0;

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <p style={{ color: '#aaa' }}>Loading cart...</p>
    </div>
  );

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22 }}>🧺 My Cart</h1>
        {cart?.items?.length > 0 && (
          <button
            onClick={clearCart}
            style={{ background: 'none', border: 'none', color: '#c62828', fontSize: 13, fontWeight: 600 }}
          >
            Clear All
          </button>
        )}
      </div>

      {!cart?.items?.length ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: 60 }}>🧺</p>
          <h2 style={{ marginTop: 16, color: '#555' }}>Your cart is empty</h2>
          <p style={{ color: '#aaa', marginTop: 8, marginBottom: 24 }}>
            Add some groceries to get started
          </p>
          <button className="btn-primary" onClick={() => navigate('/products')}
            style={{ maxWidth: 200, margin: '0 auto', display: 'block' }}>
            Shop Now
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {cart.items.map(item => (
              <div key={item.product?._id} className="card"
                style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {/* Image */}
                <div style={{
                  background: '#f9f5f0', borderRadius: 10,
                  width: 64, height: 64, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                }}>
                  {item.product?.image
                    ? <img src={item.product.image} alt={item.product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 10 }} />
                    : '🛒'}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                    {item.product?.name}
                  </p>
                  <p style={{ color: '#888', fontSize: 12, marginBottom: 6 }}>
                    {item.product?.unit}
                  </p>
                  <p style={{ color: '#e65c00', fontWeight: 700, fontSize: 15 }}>
                    ₹{(item.product?.price || 0) * item.quantity}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => updateQty(item.product?._id, item.quantity - 1)}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      border: '1.5px solid #e0d8d0', background: '#fff',
                      fontSize: 16, fontWeight: 700, color: '#e65c00',
                    }}
                  >−</button>
                  <span style={{ fontWeight: 700, minWidth: 16, textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.product?._id, item.quantity + 1)}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      border: 'none', background: '#e65c00',
                      fontSize: 16, fontWeight: 700, color: '#fff',
                    }}
                  >+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="card" style={{ marginBottom: 100 }}>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#666' }}>Subtotal ({cart.items.length} items)</span>
              <span style={{ fontWeight: 600 }}>₹{total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#666' }}>Delivery</span>
              <span style={{ color: '#2e7d32', fontWeight: 600 }}>FREE</span>
            </div>
            <div style={{
              borderTop: '1px solid #f0ebe4', paddingTop: 12, marginTop: 4,
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#e65c00' }}>₹{total}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div style={{
            position: 'fixed', bottom: 70, left: 0, right: 0,
            maxWidth: 480, margin: '0 auto',
            background: '#fff', borderTop: '1px solid #f0ebe4', padding: '12px 16px',
          }}>
            <button className="btn-primary" onClick={() => navigate('/checkout')}>
              Proceed to Checkout — ₹{total}
            </button>
          </div>
        </>
      )}
    </div>
  );
}