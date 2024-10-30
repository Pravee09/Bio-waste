import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location'; // Import Expo Location to get the location

const ClaimedProductDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { product } = route.params; // Get the product from route parameters

  const handleCall = () => {
    const phoneNumber = `tel:${product.mobileNumber}`; // Use the producer's mobile number
    Linking.openURL(phoneNumber);
  };

  const handleGetLocation = async () => {
    // Get the location coordinates from the product
    const { location } = product; // Assuming location is an object with latitude and longitude
    const { latitude, longitude } = location;

    const response = await Location.requestForegroundPermissionsAsync();
    if (response.status === 'granted') {
      const url = `http://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    } else {
      alert('Location permission not granted');
    }
  };

  return (
    <View style={styles.container}>
      {/* Construct the image URI */}
      <Image 
        source={{ uri: `http:// 192.168.127.61:5000/${product.image}` }} 
        style={styles.productImage} 
        onError={(e) => console.error('Image loading error:', e.nativeEvent.error)} // Error handling
      />
      <Text style={styles.productName}>{product.productName}</Text>
      <Text>Claimed on: {new Date(product.createdAt).toLocaleDateString()}</Text>

      <TouchableOpacity style={styles.button} onPress={handleCall}>
        <Text style={styles.buttonText}>Call Producer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGetLocation}>
        <Text style={styles.buttonText}>Get Producer Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ClaimedProductDetailsScreen;
