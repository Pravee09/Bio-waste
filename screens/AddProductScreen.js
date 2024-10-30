import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProductScreen = () => {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [producerId, setProducerId] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(''); // New state for mobile number

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      const id = await AsyncStorage.getItem('producerId');
      setProducerId(id);
    })();
  }, []);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      Alert.alert('Image selection canceled');
    }
  };

  const handleCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      Alert.alert('Camera action canceled');
    }
  };

  const handleSubmit = async () => {
    if (!image || !location || !producerId || !mobileNumber) {
      Alert.alert('Please select an image, ensure location is fetched, and you are logged in, including your mobile number.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const filename = image.split('/').pop();
      const type = `image/${filename.split('.').pop()}`;
      formData.append('image', { uri: image, name: filename, type });
      formData.append('location', JSON.stringify({
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      }));
      formData.append('producerId', producerId);
      formData.append('mobileNumber', mobileNumber); // Include mobile number

      const response = await fetch('http://10.100.53.34:5000/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create listing: ${errorText}`);
      }

      Alert.alert('Listing submitted successfully!');
      navigation.navigate('ProducerScreen');
    } catch (error) {
      console.error('Error submitting listing:', error);
      Alert.alert('Error', `Failed to submit listing: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Listing</Text>
      <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
        <Text style={styles.buttonText}>Choose image from gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCamera}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}

      <Text style={styles.locationText}>
        {location ? `Location: Lat ${location.latitude}, Lon ${location.longitude}` : 'Fetching location...'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter mobile number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Listing'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 30, fontWeight: 'bold', color: '#333' },
  button: { backgroundColor: '#36A4A4', padding: 15, borderRadius: 40, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  imagePreview: { width: 100, height: 100, marginTop: 10, alignSelf: 'center', borderRadius: 10 },
  locationText: { marginVertical: 10, textAlign: 'center', color: '#666' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginVertical: 10 },
});

export default AddProductScreen;
