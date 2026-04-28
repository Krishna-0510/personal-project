import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['pending', 'accepted', 'ready', 'collected'];

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

const STATUS_MESSAGES = {
  pending:   'Your order has been placed and is waiting for the store to confirm.',
  accepted:  'Great! The store has accepted your order and is preparing it.',
  declined:  'Sorry, the store could not accept this order. Please contact the store.',
  ready:     'Your order is ready! Please collect it from Krishna Kirana Store.',
  collected: 'Order collected successfully. Thank you for shopping with us! 🙏',
  cancelled: 'This order was cancelled.',
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/${id}`);
        setOrder(res.data);
      } catch {
        toast.error('Order not found');
        navigate('/orders');
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  const cancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await api.post(`/api/orders/${id}/cancel`);
      toast.success('Order cancelled');
      setOrder(prev => ({ ...prev, status: 'cancelled' }));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cannot cancel this order');
    }
    setCancelling(false);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <p style={{ color: '#aaa' }}>Loading order...</p>
    </div>
  );

  if (!order) return null;

  const total = order.items?.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0
  ) || order.totalAmount || 0;

  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isTerminal = ['declined', 'cancelled'].includes(order.status);
  const canCancel = order.status === 'pending';

  return (
    <div className="page">
      {/* Back */}
      <button onClick={() => navigate('/orders')}
        style={{ background: 'none', border: 'none', fontSize: 22, padding: '0 0 16px', color: '#333' }}>
        ←
      </button>

      {/* Order Header */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, marginBottom: 4 }}>
              Order #{order._id?.slice(-6).toUpperCase()}
            </h2>
            <p style={{ fontSize: 12, color: '#aaa' }}>{formatDate(order.createdAt)}</p>
          </div>
          <div style={{
            background: statusStyle.bg, color: statusStyle.text,
            borderRadius: 20, padding: '6px 14px',
            fontSize: 13, fontWeight: 700,
          }}>
            {STATUS_ICONS[order.status]} {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </div>
        </div>
        <p style={{ color: '#666', fontSize: 13, lineHeight: 1.5 }}>
          {STATUS_MESSAGES[order.status]}
        </p>
      </div>

      {/* Progress Tracker (only for non-terminal) */}
      {!isTerminal && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, marginBottom: 16, color: '#555' }}>Order Progress</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {STATUS_STEPS.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 'none' }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: i <= currentStep ? '#e65c00' : '#f0ebe4',
                    color: i <= currentStep ? '#fff' : '#bbb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, margin: '0 auto 4px',
                  }}>
                    {i < currentStep ? '✓' : i === currentStep ? STATUS_ICONS[step] : '○'}
                  </div>
                  <p style={{
                    fontSize: 10, color: i <= currentStep ? '#e65c00' : '#bbb',
                    fontWeight: i === currentStep ? 700 : 400,
                    maxWidth: 48, textAlign: 'center',
                  }}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div style={{
                    flex: 1, height: 2, margin: '0 4px',
                    background: i < currentStep ? '#e65c00' : '#f0ebe4',
                    marginBottom: 18,
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>🛒 Items Ordered</h3>
        {order.items?.map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingBottom: 10, marginBottom: 10,
            borderBottom: i < order.items.length - 1 ? '1px solid #f5f0eb' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                background: '#f9f5f0', borderRadius: 8, width: 44, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>
                {item.product?.image
                  ? <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
                  : '🛒'}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{item.product?.name || item.name}</p>
                <p style={{ color: '#888', fontSize: 12 }}>₹{item.price} × {item.quantity}</p>
              </div>
            </div>
            <p style={{ fontWeight: 700, color: '#e65c00' }}>
              ₹{(item.price || 0) * (item.quantity || 1)}
            </p>
          </div>
        ))}
      </div>

      {/* Delivery & Payment */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>📍 Delivery Details</h3>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 10, lineHeight: 1.5 }}>
          {order.address || 'No address provided'}
        </p>
        {order.note && (
          <p style={{ fontSize: 13, color: '#888', fontStyle: 'italic' }}>
            Note: {order.note}
          </p>
        )}
        <div style={{ borderTop: '1px solid #f0ebe4', paddingTop: 10, marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: '#666', fontSize: 13 }}>Payment Method</span>
            <span style={{ fontWeight: 600, fontSize: 13 }}>
              {order.paymentMethod === 'cod' ? '💵 Cash on Delivery'
                : order.paymentMethod === 'wallet' ? '👛 Wallet'
                : '📲 UPI'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Total Amount</span>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#e65c00' }}>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      {canCancel && (
        <button
          onClick={cancelOrder}
          disabled={cancelling}
          style={{
            width: '100%', padding: '14px', borderRadius: 10,
            border: '2px solid #c62828', background: '#fff', color: '#c62828',
            fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 20,
          }}
        >
          {cancelling ? 'Cancelling...' : '🚫 Cancel Order'}
        </button>
      )}
    </div>
  );
}