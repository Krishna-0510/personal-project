import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/auth/profile');
        setProfile(res.data);
        setName(res.data?.name || user?.displayName || '');
        setAddress(res.data?.address || '');
        setEmail(res.data?.email || user?.email || '');
      } catch {
        toast.error('Could not load profile');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/api/auth/profile', { name, address, email });
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Could not update profile');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    await logout();
    navigate('/login');
  };

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <p style={{ color: '#aaa' }}>Loading profile...</p>
    </div>
  );

  return (
    <div className="page">
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>👤 My Profile</h1>

      {/* Avatar */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #e65c00, #f9a825)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, margin: '0 auto 12px',
        }}>
          {user?.photoURL
            ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            : '👤'}
        </div>
        <h2 style={{ fontSize: 18 }}>{name || 'Krishna Kirana Customer'}</h2>
        <p style={{ color: '#888', fontSize: 13 }}>
          {user?.phoneNumber || user?.email || 'Customer'}
        </p>
      </div>

      {/* Profile Info */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15 }}>Personal Information</h3>
          <button
            onClick={() => setEditing(!editing)}
            style={{
              background: editing ? '#f0ebe4' : '#fff3ec',
              border: 'none', borderRadius: 8,
              padding: '6px 14px', color: '#e65c00',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}
          >
            {editing ? 'Cancel' : '✏️ Edit'}
          </button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Full Name</label>
          {editing
            ? <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            : <p style={{ fontSize: 15, fontWeight: 500 }}>{name || '—'}</p>}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Phone Number</label>
          <p style={{ fontSize: 15, fontWeight: 500, color: '#555' }}>
            {user?.phoneNumber || '—'}
          </p>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Email</label>
          {editing
            ? <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional)" type="email" />
            : <p style={{ fontSize: 15, fontWeight: 500 }}>{email || '—'}</p>}
        </div>

        <div style={{ marginBottom: editing ? 16 : 0 }}>
          <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Default Address</label>
          {editing
            ? (
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Your delivery address..."
                rows={2}
                style={{
                  width: '100%', border: '1.5px solid #e0d8d0', borderRadius: 10,
                  padding: '12px 14px', fontFamily: 'Hind, sans-serif', fontSize: 14,
                  outline: 'none', resize: 'none',
                }}
              />
            )
            : <p style={{ fontSize: 14, color: address ? '#333' : '#bbb', lineHeight: 1.5 }}>
                {address || 'No address added yet'}
              </p>}
        </div>

        {editing && (
          <button className="btn-primary" onClick={saveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      {/* Quick Links */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, marginBottom: 12 }}>Quick Links</h3>
        {[
          { icon: '📦', label: 'My Orders', path: '/orders' },
          { icon: '👛', label: 'My Wallet', path: '/wallet' },
          { icon: '🛍️', label: 'Shop Products', path: '/products' },
        ].map(link => (
          <div
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 0', borderBottom: '1px solid #f5f0eb', cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{link.icon}</span>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{link.label}</span>
            </div>
            <span style={{ color: '#bbb', fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>

      {/* App Info */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: '#888', fontSize: 13 }}>Store</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Krishna Kirana, Killa-Pardi</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#888', fontSize: 13 }}>App Version</span>
          <span style={{ fontSize: 13, color: '#aaa' }}>v1.0.0</span>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          width: '100%', padding: '14px', borderRadius: 10,
          border: '2px solid #c62828', background: '#fff', color: '#c62828',
          fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 20,
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
}