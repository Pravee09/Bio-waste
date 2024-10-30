// RegistrationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import SegmentedControl from '@react-native-community/segmented-control';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('consumer');

  const handleRegister = async () => {
    console.log('Registration data:', { name, email, password, mobile, role });
    try {
      const response = await fetch('http://10.100.53.34:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, mobile, role }),
      });

      const result = await response.json();
      console.log('Registration result:', result);

      if (response.ok) {
        await AsyncStorage.setItem('role', role);
        if (result.user?.producerId) {
          await AsyncStorage.setItem('producerId', result.user.producerId);
        } else {
          await AsyncStorage.removeItem('producerId');
        }
        if (result.user?.consumerId) {
          await AsyncStorage.setItem('consumerId', result.user.consumerId);
        } else {
          await AsyncStorage.removeItem('consumerId');
        }

        Alert.alert('Registration successful!', 'You can now log in.', [
          { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
        ]);
      } else {
        Alert.alert('Registration failed', result.message || 'An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Again!</Text>
      <Image source={require('../assets/Screenshot_2024-10-27_123834-removebg-preview.png')} style={styles.image} />
      
      <TextInput
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="#000"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        placeholderTextColor="#000"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#000"
      />
      <TextInput
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        style={styles.input}
        placeholderTextColor="#000"
      />
      <SegmentedControl
        values={['Consumer', 'Producer']}
        selectedIndex={role === 'consumer' ? 0 : 1}
        onChange={(event) => {
          const selectedValue = event.nativeEvent.selectedSegmentIndex === 0 ? 'consumer' : 'producer';
          setRole(selectedValue);
        }}
        style={styles.segmentedControl}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.alreadyText}>
        Already registered? <Text onPress={() => navigation.navigate('LoginScreen')} style={styles.signInText}>Sign in</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#F5F5F5' },
  image: { width: 200, height: 200, alignSelf: 'center', marginBottom: 50 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 30, fontWeight: 'bold', color: '#333' },
  input: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10, borderRadius: 10, backgroundColor: '#FFF' },
  segmentedControl: { marginVertical: 20, backgroundColor: '#F5F5F5' },
  button: { backgroundColor: '#36A4A4', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  orText: { textAlign: 'center', marginVertical: 10, color: '#888' },
  googleButton: { backgroundColor: '#FFF', padding: 10, borderRadius: 50, alignItems: 'center', width: 50, alignSelf: 'center' },
  googleText: { fontSize: 24, color: '#DB4437' },
  alreadyText: { textAlign: 'center', marginTop: 20, color: '#888' },
  signInText: { color: '#36A4A4', fontWeight: 'bold' },
});

export default RegistrationScreen;
