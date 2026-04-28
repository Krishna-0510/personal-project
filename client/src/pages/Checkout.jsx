import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'wallet' | 'upi'
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartRes, profileRes] = await Promise.all([
          api.get('/api/cart'),
          api.get('/api/auth/profile'),
        ]);
        setCart(cartRes.data);
        setUser(profileRes.data);
        setWallet(profileRes.data?.walletBalance || 0);
        setAddress(profileRes.data?.address || '');
      } catch {
        toast.error('Failed to load checkout data');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const total = cart?.items?.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity, 0
  ) || 0;

  const placeOrder = async () => {
    if (!address.trim()) return toast.error('Please enter your delivery address');
    if (paymentMethod === 'wallet' && wallet < total)
      return toast.error('Insufficient wallet balance');

    setPlacing(true);
    try {
      const res = await api.post('/api/orders/place', {
        address,
        note,
        paymentMethod,
      });
      toast.success('Order placed! 🎉');
      navigate(`/orders/${res.data.order?._id || ''}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not place order');
    }
    setPlacing(false);
  };

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <p style={{ color: '#aaa' }}>Loading checkout...</p>
    </div>
  );

  if (!cart?.items?.length) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 60 }}>
        <p style={{ fontSize: 50 }}>🧺</p>
        <h2 style={{ marginTop: 16 }}>Cart is empty</h2>
        <button className="btn-primary" onClick={() => navigate('/products')}
          style={{ maxWidth: 200, margin: '24px auto 0', display: 'block' }}>
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <button onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', fontSize: 22, padding: '0 0 16px', color: '#333' }}>
        ←
      </button>

      <h1 style={{ fontSize: 22, marginBottom: 20 }}>📋 Checkout</h1>

      {/* Delivery Address */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, marginBottom: 10 }}>📍 Delivery Address</h3>
        <textarea
          placeholder="Enter your full delivery address..."
          value={address}
          onChange={e => setAddress(e.target.value)}
          rows={3}
          style={{
            width: '100%', border: '1.5px solid #e0d8d0', borderRadius: 10,
            padding: '12px 14px', fontFamily: 'Hind, sans-serif', fontSize: 14,
            outline: 'none', resize: 'none',
          }}
        />
      </div>

      {/* Order Note */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, marginBottom: 10 }}>📝 Order Note (optional)</h3>
        <input
          placeholder="Any special instructions for the store..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      {/* Order Summary */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>🧾 Order Summary</h3>
        {cart.items.map(item => (
          <div key={item.product?._id}
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#555', fontSize: 14 }}>
              {item.product?.name} × {item.quantity}
            </span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>
              ₹{(item.product?.price || 0) * item.quantity}
            </span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #f0ebe4', paddingTop: 10, marginTop: 6,
          display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700 }}>Total</span>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#e65c00' }}>₹{total}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="card" style={{ marginBottom: 100 }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>💳 Payment Method</h3>

        {[
          { id: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when you collect' },
          {
            id: 'wallet',
            label: `👛 Wallet (₹${wallet} available)`,
            desc: wallet >= total ? 'Sufficient balance' : `Need ₹${total - wallet} more`,
          },
          { id: 'upi', label: '📲 UPI / Online', desc: 'Pay via UPI at store' },
        ].map(opt => (
          <div
            key={opt.id}
            onClick={() => setPaymentMethod(opt.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderRadius: 10, marginBottom: 8, cursor: 'pointer',
              border: `2px solid ${paymentMethod === opt.id ? '#e65c00' : '#e0d8d0'}`,
              background: paymentMethod === opt.id ? '#fff3ec' : '#fff',
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${paymentMethod === opt.id ? '#e65c00' : '#ccc'}`,
              background: paymentMethod === opt.id ? '#e65c00' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {paymentMethod === opt.id && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
              )}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</p>
              <p style={{ color: '#888', fontSize: 12 }}>{opt.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Place Order Button */}
      <div style={{
        position: 'fixed', bottom: 70, left: 0, right: 0,
        maxWidth: 480, margin: '0 auto',
        background: '#fff', borderTop: '1px solid #f0ebe4', padding: '12px 16px',
      }}>
        <button className="btn-primary" onClick={placeOrder} disabled={placing}>
          {placing ? 'Placing Order...' : `Place Order — ₹${total}`}
        </button>
      </div>
    </div>
  );
}