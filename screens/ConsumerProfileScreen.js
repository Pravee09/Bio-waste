import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConsumerProfileScreen = ({ navigation }) => {
  const [consumerDetails, setConsumerDetails] = useState({
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
    fetchConsumerDetails();
  }, []);

  const fetchConsumerDetails = async () => {
    try {
      const consumerId = await AsyncStorage.getItem('consumerId');
      console.log('Fetched Consumer ID:', consumerId); // Log for debugging
  
      if (!consumerId) {
        console.error('Consumer ID not found in AsyncStorage');
        Alert.alert('Error', 'Consumer ID not found. Please log in again.');
        return;
      }
  
      const response = await fetch(`http:// 192.168.127.61:5000/api/auth/consumers/${consumerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorResponse = await response.text(); // Get response text for debugging
        console.error('Response Error:', errorResponse);
        throw new Error('Failed to fetch consumer details');
      }
  
      const data = await response.json();
      console.log('Consumer Details:', data);
      setConsumerDetails(data.user);
    } catch (error) {
      console.error('Error fetching consumer details:', error);
      Alert.alert('Error', error.message || 'Failed to fetch consumer details');
    }
  };
  
  const handleUpdateDetails = async () => {
    try {
        const consumerId = await AsyncStorage.getItem('consumerId');
        const response = await fetch(`http:// 192.168.127.61:5000/api/auth/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                consumerId,
                ...consumerDetails,
            }),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message || 'Failed to update details');
        }

        Alert.alert('Success', 'User details updated successfully', [
            {
                text: 'OK',
                onPress: () => navigation.navigate('ConsumerScreen'), // Navigate to ConsumerScreen
            },
        ]);
    } catch (error) {
        console.error('Error updating user details:', error);
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
        const consumerId = await AsyncStorage.getItem('consumerId');
        const response = await fetch(`http:// 192.168.127.61:5000/api/auth/consumers/${consumerId}/update-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        });

        const responseText = await response.text();
        console.log('Raw Response:', responseText);

        if (!response.ok) {
            throw new Error(responseText);
        }

        const responseData = JSON.parse(responseText);

        Alert.alert('Success', 'Password updated successfully', [
            {
                text: 'OK',
                onPress: () => navigation.navigate('ConsumerScreen'), // Navigate to ConsumerScreen
            },
        ]);
        setPasswordDetails({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
        console.error('Error updating password:', error);
        Alert.alert('Error', error.message || 'Failed to update password.');
    }
};

  

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('consumerId'); // Remove consumer ID upon logout
      Alert.alert('Logout successful');
      navigation.replace('LoginScreen'); // Navigate to Login screen after logout
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Logout failed', 'Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consumer Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={consumerDetails.name}
        onChangeText={(text) => setConsumerDetails({ ...consumerDetails, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={consumerDetails.email}
        onChangeText={(text) => setConsumerDetails({ ...consumerDetails, email: text })}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={consumerDetails.mobileNumber}
        onChangeText={(text) => setConsumerDetails({ ...consumerDetails, mobileNumber: text })}
        keyboardType="phone-pad"
      />

      <Button title="Update Details" onPress={handleUpdateDetails} />

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

      <Button title="Update Password" onPress={handleUpdatePassword} />

      <Button title="Logout" onPress={handleLogout} color="#F44336" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default ConsumerProfileScreen;
