import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function OrderDetail() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const token = await auth().currentUser?.getIdToken();
      const response = await axios.get(`${API_URL}/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load order');
    }
    setLoading(false);
  };

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const token = await auth().currentUser?.getIdToken();
      await axios.put(
        `${API_URL}/api/admin/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder({ ...order, status });
      Toast.show({
        type: 'success',
        text1: 'Status Updated!',
        text2: `Order marked as ${status}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.heading}>Order #{order._id.slice(-6)}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{order.userId?.name || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{order.userId?.phone || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{order.deliveryAddress || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items?.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.productId?.name || 'Product'}</Text>
            <Text style={styles.itemQty}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>₹{item.price}</Text>
          </View>
        ))}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Status</Text>
        <Pressable
          style={[styles.statusButton, styles.confirmedButton]}
          onPress={() => updateStatus('confirmed')}
          disabled={updating || order.status === 'confirmed'}
        >
          <Text style={styles.statusButtonText}>✅ Mark Confirmed</Text>
        </Pressable>
        <Pressable
          style={[styles.statusButton, styles.deliveredButton]}
          onPress={() => updateStatus('delivered')}
          disabled={updating || order.status === 'delivered'}
        >
          <Text style={styles.statusButtonText}>🚚 Mark Delivered</Text>
        </Pressable>
      </View>

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    marginBottom: 15,
  },
  backText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#666',
    width: 80,
  },
  value: {
    flex: 1,
    color: '#1f2937',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemName: {
    flex: 1,
    color: '#1f2937',
  },
  itemQty: {
    color: '#666',
    marginHorizontal: 10,
  },
  itemPrice: {
    fontWeight: 'bold',
    color: '#2563eb',
  },
  totalAmount: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1f2937',
  },
  statusButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmedButton: {
    backgroundColor: '#1e40af',
  },
  deliveredButton: {
    backgroundColor: '#166534',
  },
  statusButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});