import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const token = await auth().currentUser?.getIdToken();
      await axios.post(
        `${API_URL}/api/products`,
        {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Toast.show({
        type: 'success',
        text1: 'Product Added! ✅',
        text2: `${formData.name} added successfully`,
      });
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.heading}>Add New Product</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Tata Salt"
          placeholderTextColor="#ccc"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Grocery, Dairy, Snacks"
          placeholderTextColor="#ccc"
          value={formData.category}
          onChangeText={(text) => setFormData({ ...formData, category: text })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Price (₹) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 25"
          placeholderTextColor="#ccc"
          keyboardType="number-pad"
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Stock Quantity *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 100"
          placeholderTextColor="#ccc"
          keyboardType="number-pad"
          value={formData.stock}
          onChangeText={(text) => setFormData({ ...formData, stock: text })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Add product details..."
          placeholderTextColor="#ccc"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>✅ Add Product</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>❌ Cancel</Text>
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
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    fontSize: 14,
    color: '#1f2937',
  },
  textarea: {
    textAlignVertical: 'top',
    height: 100,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 30,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#16a34a',
  },
  cancelButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});