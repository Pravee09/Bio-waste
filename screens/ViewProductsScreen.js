import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ViewProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchProducts = async () => {
    try {
      const producerId = await AsyncStorage.getItem('producerId');
      if (!producerId) {
        Alert.alert('Error', 'No producer ID found. Please log in again.');
        return;
      }

      const response = await fetch(`http://10.100.53.34:5000/api/products/producer/${producerId}`);
      const data = await response.json();

      console.log('Fetched Products:', data); // Log the fetched products
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleNavigateToDetails = (productId) => {
    navigation.navigate('ProductDetailsScreen', { productId });
  };

  return (
    <View>
      {products.length === 0 ? (
        <Text>No products found.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View>
              {item.image && (
                <TouchableOpacity onPress={() => handleNavigateToDetails(item._id)}>
                  <Image 
                    source={{ uri: `http://10.100.53.34:5000/${item.image}` }} 
                    style={{ width: 100, height: 100 }} 
                  />
                </TouchableOpacity>
              )}
              {item.location && (
                <Text>Location: {JSON.stringify(item.location.coordinates)}</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ViewProductsScreen;
