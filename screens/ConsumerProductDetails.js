import React from 'react';
import { View, Image, Button, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConsumerProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params; // Get the product details from the route parameters

  const handleFullScreenImage = () => {
    navigation.navigate('FullScreenImage', { imageUri: product.image });
  };

  const handleCallProducer = () => {
    const phoneNumber = `tel:${product.mobileNumber}`;
    Linking.openURL(phoneNumber);
  };

  const handleClaimProduct = async () => {
    try {
      const consumerId = await AsyncStorage.getItem('consumerId');
      if (!consumerId) {
        Alert.alert('Error', 'Consumer ID not found. Please log in again.');
        return;
      }

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to claim the product.');
        return;
      }

      // Get the user's current location
      const location = await Location.getCurrentPositionAsync({});
      const locationCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Send the claim request to the backend
      const response = await fetch('http://10.100.53.34:5000/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,  // Use the product ID from route params
          consumerId,
          location: locationCoordinates,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to claim product');
      }

      Alert.alert('Success', 'Product claimed successfully!');
      navigation.navigate('ConsumerClaimsScreen'); // Navigate to claims screen if needed
    } catch (error) {
      console.error('Error claiming product:', error);
      Alert.alert('Error', 'Failed to claim product: ' + error.message);
    }
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${product.location.coordinates[1]},${product.location.coordinates[0]}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleFullScreenImage}>
        <Image
          source={{ uri: `http://10.100.53.34:5000/${product.image}` }} // Correct URL for image
          style={styles.productImage}
          onError={(e) => console.error('Image loading error:', e.nativeEvent.error)} // Error handling
        />
      </TouchableOpacity>

      {/* Buttons only */}
      <Button title="Call to Confirm" onPress={handleCallProducer} />
      <Button title="Claim Product" onPress={handleClaimProduct} />
      <Button title="Get Directions" onPress={handleGetDirections} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
});

export default ConsumerProductDetails;
