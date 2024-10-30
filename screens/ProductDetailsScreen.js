import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const ProductDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { productId, refreshProducts } = route.params || {};
  const [producerId, setProducerId] = useState(null);
  const [productDetails, setProductDetails] = useState({});

  const SERVER_URL = 'http://10.100.53.34:5000';

  useEffect(() => {
    if (!productId) {
      Alert.alert("Error", "Product ID not found.");
      navigation.goBack();
      return;
    }

    const fetchProducerId = async () => {
      const storedProducerId = await AsyncStorage.getItem('producerId');
      setProducerId(storedProducerId);
    };

    fetchProducerId();

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product details');

        const data = await response.json();
        setProductDetails(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load product details.');
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleDeleteProduct = async () => {
    if (!producerId) {
      Alert.alert('Error', 'Producer ID not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/products/${productId}/${producerId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');

      Alert.alert('Success', 'Product deleted successfully!');
      refreshProducts && refreshProducts();
      navigation.navigate('ViewProductsScreen');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to delete product.');
    }
  };

  const handleViewClaims = () => {
    navigation.navigate('ProducerClaimsScreen', { productId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: `${SERVER_URL}/${productDetails.image}` }} style={styles.productImage} />
        <Text style={styles.productName}>{productDetails.productName}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProduct}>
        <Text style={styles.buttonText}>Delete Listing</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewClaimsButton} onPress={handleViewClaims}>
        <Text style={styles.buttonText}>View Claims</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  productImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 15,
  },
  productName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A237E',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF5350',
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#D32F2F',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  viewClaimsButton: {
    backgroundColor: '#42A5F5',
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ProductDetailsScreen;
