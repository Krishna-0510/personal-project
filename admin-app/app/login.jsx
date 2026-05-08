import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://172.25.40.73:5000'; // ← replace with your PC's local IP

export default function Login() {
  const [phone, setPhone]       = useState('');
  const [otp, setOtp]           = useState('');
  const [step, setStep]         = useState('phone'); // 'phone' | 'otp' | 'recover'
  const [recoveryCode, setRecoveryCode] = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  // ── Step 1: Send OTP ────────────────────────────────────────
  const sendOTP = async () => {
    if (phone.length !== 10) {
      Alert.alert('Error', 'Enter valid 10-digit phone number');
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/auth/send-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      } else {
        Alert.alert('OTP Sent', 'Check your server terminal for the OTP');
        setStep('otp');
      }
    } catch (err) {
      Alert.alert('Error', 'Cannot reach server. Check your IP and WiFi.');
    }
    setLoading(false);
  };

  // ── Step 2: Verify OTP ──────────────────────────────────────
  const verifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/auth/verify-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Error', data.message || 'Invalid OTP');
      } else {
        await AsyncStorage.setItem('adminToken', data.token);
        router.replace('/dashboard');
      }
    } catch (err) {
      Alert.alert('Error', 'Cannot reach server. Check your IP and WiFi.');
    }
    setLoading(false);
  };

  // ── Recovery: Bypass OTP ────────────────────────────────────
  const recover = async () => {
    if (!recoveryCode) {
      Alert.alert('Error', 'Enter your recovery code');
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/auth/recover`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phone, recoveryCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert('Error', data.message || 'Recovery failed');
      } else {
        await AsyncStorage.setItem('adminToken', data.token);
        router.replace('/dashboard');
      }
    } catch (err) {
      Alert.alert('Error', 'Cannot reach server. Check your IP and WiFi.');
    }
    setLoading(false);
  };

  // ── UI ───────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏪 Krishna Kirana</Text>
      <Text style={styles.subtitle}>Admin App</Text>

      {/* ── Phone step ── */}
      {step === 'phone' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Phone Number (10 digits)"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
          />
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={sendOTP}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send OTP'}</Text>
          </Pressable>
          <Pressable onPress={() => setStep('recover')}>
            <Text style={styles.link}>Locked out? Use recovery code</Text>
          </Pressable>
        </>
      )}

      {/* ── OTP step ── */}
      {step === 'otp' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit OTP"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
          />
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={verifyOTP}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify OTP'}</Text>
          </Pressable>
          <Pressable onPress={() => setStep('phone')}>
            <Text style={styles.link}>← Back</Text>
          </Pressable>
          <Pressable onPress={() => setStep('recover')} style={{ marginTop: 8 }}>
            <Text style={styles.link}>Locked out? Use recovery code</Text>
          </Pressable>
        </>
      )}

      {/* ── Recovery step ── */}
      {step === 'recover' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Phone Number (10 digits)"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
          />
          <TextInput
            style={styles.input}
            placeholder="Recovery Code"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={recoveryCode}
            onChangeText={setRecoveryCode}
          />
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={recover}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Recovering...' : 'Recover Access'}</Text>
          </Pressable>
          <Pressable onPress={() => setStep('phone')}>
            <Text style={styles.link}>← Back to Login</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1f2937',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#2563eb',
    fontSize: 14,
    marginTop: 4,
  },
});