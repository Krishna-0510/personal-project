import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://172.25.40.73:5000';

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data.stats || { todayOrders: 0, todayRevenue: 0, totalProducts: 0 });
    } catch (error) {
      console.error('Error fetching stats:', error.message);
    }
    setLoading(false);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('adminToken');
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Today's Summary</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.todayOrders}</Text>
          <Text style={styles.statLabel}>Orders Today</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pendingOrders}</Text>
          <Text style={styles.statLabel}>Pending Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalProducts}</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push('/orders')}
        >
          <Text style={styles.actionButtonText}>📋 View All Orders</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => router.push('/products')}
        >
          <Text style={styles.actionButtonText}>📦 Manage Products</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.logoutButton]}
          onPress={logout}
        >
          <Text style={styles.actionButtonText}>🔴 Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  statsContainer: {
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#2563eb',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});