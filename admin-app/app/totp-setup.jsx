import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://172.25.40.73:5000';

export default function TotpSetup() {
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('setup'); // 'setup' | 'verify'
  const router = useRouter();

  const getQRCode = async () => {
    setLoading(true);
    try {
      const jwt = await AsyncStorage.getItem('adminToken');
      const res = await fetch(API + '/api/admin/totp/setup', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + jwt,
        },
      });
      const data = await res.json();
      if (data.success) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setStep('verify');
      } else {
        Alert.alert('Error', data.message || 'Failed to get QR code');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to server');
    }
    setLoading(false);
  };

  const verifyToken = async () => {
    if (token.length !== 6) {
      Alert.alert('Error', 'Enter 6-digit code from Google Authenticator');
      return;
    }
    setLoading(true);
    try {
      const jwt = await AsyncStorage.getItem('adminToken');
      const res = await fetch(API + '/api/admin/totp/verify', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + jwt,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Success', 'TOTP enabled successfully!', [
          { text: 'OK', onPress: () => router.replace('/dashboard') }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Invalid code');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to server');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Two-Factor Setup</Text>
      <Text style={styles.subtitle}>Google Authenticator</Text>

      {step === 'setup' && (
        <>
          <Text style={styles.hint}>
            Scan a QR code with Google Authenticator to enable 2FA on your account.
          </Text>
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={getQRCode}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : 'Get QR Code'}
            </Text>
          </Pressable>
        </>
      )}

      {step === 'verify' && (
        <>
          <Text style={styles.hint}>Scan this QR code with Google Authenticator:</Text>

          {qrCode && (
            <Image
              source={{ uri: qrCode }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          )}

          <Text style={styles.secretLabel}>Manual entry key:</Text>
          <Text style={styles.secret}>{secret}</Text>

          <Text style={styles.hint}>Enter the 6-digit code from the app:</Text>
          <TextInput
            style={styles.input}
            placeholder="000000"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={token}
            onChangeText={setToken}
            maxLength={6}
          />
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={verifyToken}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Verifying...' : 'Verify & Enable'}
            </Text>
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
    marginBottom: 30,
  },
  hint: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrImage: {
    width: 220,
    height: 220,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  secretLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  secret: {
    fontSize: 13,
    color: '#374151',
    fontFamily: 'monospace',
    marginBottom: 20,
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 24,
    backgroundColor: 'white',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 8,
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
});
