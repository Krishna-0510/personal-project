import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { auth } from '../context/AuthContext';
import { auth } from '../firebase/config';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const sendOTP = async () => {
    if (phone.length < 10) return toast.error('Enter valid phone number');
    setLoading(true);
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(
        auth, '+91' + phone, window.recaptchaVerifier
      );
      setConfirm(result);
      setStep('otp');
      toast.success('OTP sent!');
    } catch (err) {
      toast.error('Failed to send OTP. Try again.');
      console.error(err);
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');
    setLoading(true);
    try {
      const result = await confirm.confirm(otp);
      const idToken = await result.user.getIdToken();
      await api.post('/api/auth/register', {}, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      localStorage.setItem('token', idToken);
      toast.success('Logged in!');
      navigate('/');
    } catch (err) {
      toast.error('Wrong OTP. Try again.');
    }
    setLoading(false);
  };

  const googleLogin = async () => {
  setLoading(true);
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    await api.post('/api/auth/register', {}, {
      headers: { Authorization: `Bearer ${idToken}` }
    });

    localStorage.setItem('token', idToken);
    toast.success('Logged in with Google!');
    navigate('/');
  } catch (err) {
    console.error("Google Login Error:", err);
    toast.error(err.message || 'Google login failed.');
  }
  setLoading(false);
};
  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(160deg, #fff3ec 0%, #f9f5f0 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px 20px',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontSize: 56 }}>🏪</div>
        <h1 style={{ fontSize: 28, color: '#e65c00', margin: '8px 0 4px' }}>
          Krishna Kirana
        </h1>
        <p style={{ color: '#888', fontSize: 14 }}>Your neighbourhood grocery store</p>
      </div>

      {/* Card */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: 24,
        width: '100%', maxWidth: 380,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <h2 style={{ fontSize: 20, marginBottom: 20, color: '#1a1a1a' }}>
          {step === 'phone' ? 'Login / Sign Up' : 'Enter OTP'}
        </h2>

        {step === 'phone' ? (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <div style={{
                background: '#f2f2f2', borderRadius: 10, padding: '12px 14px',
                fontWeight: 600, color: '#444', whiteSpace: 'nowrap',
              }}>🇮🇳 +91</div>
              <input
                type="tel" placeholder="10-digit mobile number"
                value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onKeyDown={e => e.key === 'Enter' && sendOTP()}
              />
            </div>
            <button className="btn-primary" onClick={sendOTP} disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <div style={{ textAlign: 'center', margin: '16px 0', color: '#bbb', fontSize: 13 }}>
              — or —
            </div>

            <button className="btn-outline" onClick={googleLogin} disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>G</span>
              Continue with Google
            </button>
          </>
        ) : (
          <>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
              OTP sent to +91 {phone} —{' '}
              <span style={{ color: '#e65c00', cursor: 'pointer' }}
                onClick={() => setStep('phone')}>Change</span>
            </p>
            <input
              type="tel" placeholder="6-digit OTP" maxLength={6}
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && verifyOTP()}
              style={{ marginBottom: 16, letterSpacing: 8, fontSize: 20, textAlign: 'center' }}
            />
            <button className="btn-primary" onClick={verifyOTP} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
      </div>

      <div id="recaptcha-container" />
      <p style={{ color: '#bbb', fontSize: 12, marginTop: 24, textAlign: 'center' }}>
        By continuing, you agree to our Terms & Privacy Policy
      </p>
    </div>
  );
}