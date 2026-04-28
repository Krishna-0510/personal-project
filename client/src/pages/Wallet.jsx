import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const QUICK_AMOUNTS = [50, 100, 200, 500];

export default function Wallet() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(true);
  const [recharging, setRecharging] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const [profileRes, txRes] = await Promise.all([
          api.get('/api/auth/profile'),
          api.get('/api/orders/wallet/transactions').catch(() => ({ data: [] })),
        ]);
        setBalance(profileRes.data?.walletBalance || 0);
        setTransactions(txRes.data || []);

        // Get shop UPI from settings
        try {
          const settingsRes = await api.get('/api/admin/settings');
          setUpiId(settingsRes.data?.upiId || 'krishnakirana@upi');
        } catch {
          setUpiId('krishnakirana@upi');
        }
      } catch {
        toast.error('Could not load wallet');
      }
      setLoading(false);
    };
    fetchWallet();
  }, []);

  const requestRecharge = async () => {
    const amt = parseInt(amount);
    if (!amt || amt < 10) return toast.error('Minimum recharge is ₹10');
    if (amt > 5000) return toast.error('Maximum recharge is ₹5000');

    setRecharging(true);
    try {
      await api.post('/api/orders/wallet/recharge', { amount: amt });
      toast.success('Recharge request sent! Store will add balance after payment confirmation.');
      setShowRecharge(false);
      setAmount('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Recharge request failed');
    }
    setRecharging(false);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <p style={{ color: '#aaa' }}>Loading wallet...</p>
    </div>
  );

  return (
    <div className="page">
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>👛 My Wallet</h1>

      {/* Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #e65c00, #f9a825)',
        borderRadius: 16, padding: '24px 20px',
        color: '#fff', marginBottom: 20, textAlign: 'center',
      }}>
        <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 8 }}>Available Balance</p>
        <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 4 }}>₹{balance}</h2>
        <p style={{ fontSize: 13, opacity: 0.75 }}>Krishna Kirana Wallet</p>
      </div>

      {/* Recharge Button */}
      <button
        className="btn-primary"
        onClick={() => setShowRecharge(!showRecharge)}
        style={{ marginBottom: 16 }}
      >
        {showRecharge ? 'Close ✕' : '+ Add Money to Wallet'}
      </button>

      {/* Recharge Form */}
      {showRecharge && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, marginBottom: 8 }}>How to Recharge</h3>
          <div style={{
            background: '#f9f5f0', borderRadius: 10, padding: 14, marginBottom: 14,
            fontSize: 13, color: '#555', lineHeight: 1.7,
          }}>
            <p>1️⃣ Pay via UPI to: <strong style={{ color: '#e65c00' }}>{upiId}</strong></p>
            <p>2️⃣ Enter amount below and submit</p>
            <p>3️⃣ Store will verify and add balance</p>
          </div>

          {/* Quick Amounts */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {QUICK_AMOUNTS.map(a => (
              <button
                key={a}
                onClick={() => setAmount(String(a))}
                style={{
                  padding: '8px 16px', borderRadius: 20,
                  border: `2px solid ${amount === String(a) ? '#e65c00' : '#e0d8d0'}`,
                  background: amount === String(a) ? '#fff3ec' : '#fff',
                  color: amount === String(a) ? '#e65c00' : '#555',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer',
                }}
              >
                ₹{a}
              </button>
            ))}
          </div>

          <input
            type="number"
            placeholder="Enter amount (₹10 – ₹5000)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ marginBottom: 12 }}
          />

          <button className="btn-primary" onClick={requestRecharge} disabled={recharging}>
            {recharging ? 'Submitting...' : 'Submit Recharge Request'}
          </button>

          <p style={{ fontSize: 12, color: '#aaa', marginTop: 10, textAlign: 'center' }}>
            Balance is added after the store verifies your UPI payment.
          </p>
        </div>
      )}

      {/* Transaction History */}
      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 14 }}>Transaction History</h3>

        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#bbb' }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>📋</p>
            <p style={{ fontSize: 13 }}>No transactions yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {transactions.map((tx, i) => {
              const isCredit = tx.type === 'credit' || tx.amount > 0;
              return (
                <div key={tx._id || i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingBottom: 12, marginBottom: 12,
                  borderBottom: i < transactions.length - 1 ? '1px solid #f5f0eb' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: isCredit ? '#e8f5e9' : '#fce4ec',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18,
                    }}>
                      {isCredit ? '⬆️' : '⬇️'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>
                        {tx.description || (isCredit ? 'Wallet Recharge' : 'Order Payment')}
                      </p>
                      <p style={{ color: '#aaa', fontSize: 11 }}>
                        {formatDate(tx.createdAt || tx.date)}
                      </p>
                    </div>
                  </div>
                  <p style={{
                    fontWeight: 700, fontSize: 15,
                    color: isCredit ? '#2e7d32' : '#c62828',
                  }}>
                    {isCredit ? '+' : '−'}₹{Math.abs(tx.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}