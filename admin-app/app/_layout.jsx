import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('adminToken');
      if (token) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    };
    checkAuth();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}