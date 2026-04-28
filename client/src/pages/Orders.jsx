import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending:   { bg: '#fff8e1', text: '#f57f17' },
  accepted:  { bg: '#e8f5e9', text: '#2e7d32' },
  declined:  { bg: '#fce4ec', text: '#c62828' },
  ready:     { bg: '#e3f2fd', text: '#1565c0' },
  collected: { bg: '#f3e5f5', text: '#6a1b9a' },
  cancelled: { bg: '#fafafa', text: '#999' },
};

const STATUS_ICONS = {
  pending: '⏳', accepted: '✅', declined: '❌',
  ready: '🏪', collected: '🎉', cancelled: '🚫',
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders');
        setOrders(res.data || []);
      } catch {
        toast.error('Could not load orders');
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="page">
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>📦 My Orders</h1>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa', padding: 40 }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: 60 }}>📦</p>
          <h2 style={{ marginTop: 16, color: '#555' }}>No orders yet</h2>
          <p style={{ color: '#aaa', marginTop: 8, marginBottom: 24 }}>
            Place your first order from the shop!
          </p>
          <button className="btn-primary" onClick={() => navigate('/products')}
            style={{ maxWidth: 200, margin: '0 auto', display: 'block' }}>
            Shop Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map(order => {
            const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
            const total = order.items?.reduce(
              (sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0
            ) || order.totalAmount || 0;

            return (
              <div
                key={order._id}
                className="card"
                onClick={() => navigate(`/orders/${order._id}`)}
                style={{ cursor: 'pointer' }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>
                      Order #{order._id?.slice(-6).toUpperCase()}
                    </p>
                    <p style={{ fontSize: 12, color: '#888' }}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div style={{
                    background: statusStyle.bg, color: statusStyle.text,
                    borderRadius: 20, padding: '4px 12px',
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {STATUS_ICONS[order.status]} {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </div>
                </div>

                {/* Items Preview */}
                <div style={{ marginBottom: 10 }}>
                  {order.items?.slice(0, 2).map((item, i) => (
                    <p key={i} style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>
                      {item.product?.name || item.name} × {item.quantity}
                    </p>
                  ))}
                  {order.items?.length > 2 && (
                    <p style={{ fontSize: 12, color: '#aaa' }}>
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Footer Row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderTop: '1px solid #f0ebe4', paddingTop: 10,
                }}>
                  <span style={{ fontSize: 13, color: '#888' }}>
                    💳 {order.paymentMethod === 'cod' ? 'Cash on Delivery'
                      : order.paymentMethod === 'wallet' ? 'Wallet'
                      : 'UPI'}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: 16, color: '#e65c00' }}>
                    ₹{total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}