import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProducerProfileScreen = ({ navigation }) => {
  const [producerDetails, setProducerDetails] = useState({
    name: '',
    email: '',
    mobileNumber: '',
  });

  const [passwordDetails, setPasswordDetails] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProducerDetails();
  }, []);

  const fetchProducerDetails = async () => {
    try {
      const producerId = await AsyncStorage.getItem('producerId');
  
      if (!producerId) {
        Alert.alert('Error', 'Producer ID not found. Please log in again.');
        return;
      }
  
      const response = await fetch(`http://192.168.127.61:5000/api/auth/producers/${producerId}`);
  
      if (!response.ok) throw new Error('Failed to fetch producer details');
  
      const data = await response.json();
      setProducerDetails(data.user);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fetch producer details');
    }
  };

  const handleUpdateDetails = async () => {
    try {
      const producerId = await AsyncStorage.getItem('producerId');
      const response = await fetch(`http://192.168.127.61:5000/api/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producerId, ...producerDetails }),
      });
  
      if (!response.ok) throw new Error('Failed to update details');
      Alert.alert('Success', 'User details updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update user details.');
    }
  };

  const handleUpdatePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordDetails;
  
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All password fields are required.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
  
    try {
      const producerId = await AsyncStorage.getItem('producerId');
      const response = await fetch(`http://192.168.127.61:5000/api/auth/producers/${producerId}/update-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) throw new Error('Failed to update password');
  
      Alert.alert('Success', 'Password updated successfully');
      setPasswordDetails({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update password.');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Logout successful');
      navigation.replace('LoginScreen');
    } catch (error) {
      Alert.alert('Logout failed', 'Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Producer Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={producerDetails.name}
        onChangeText={(text) => setProducerDetails({ ...producerDetails, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={producerDetails.email}
        onChangeText={(text) => setProducerDetails({ ...producerDetails, email: text })}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={producerDetails.mobileNumber}
        onChangeText={(text) => setProducerDetails({ ...producerDetails, mobileNumber: text })}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateDetails}>
        <Text style={styles.buttonText}>Update Details</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Change Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        value={passwordDetails.currentPassword}
        onChangeText={(text) => setPasswordDetails({ ...passwordDetails, currentPassword: text })}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={passwordDetails.newPassword}
        onChangeText={(text) => setPasswordDetails({ ...passwordDetails, newPassword: text })}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={passwordDetails.confirmPassword}
        onChangeText={(text) => setPasswordDetails({ ...passwordDetails, confirmPassword: text })}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    margin: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginVertical: 15,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#666',
    marginTop: 25,
    marginBottom: 10,
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF4E42',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProducerProfileScreen;
