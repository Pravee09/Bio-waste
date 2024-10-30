// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.100.53.34:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
    

      if (response.ok) {
        await AsyncStorage.setItem('role', result.role);

        if (result.user?.producerId) {
          await AsyncStorage.setItem('producerId', result.user.producerId);
          navigation.navigate('ProducerScreen');
        } else if (result.user?.consumerId) {
          await AsyncStorage.setItem('consumerId', result.user.consumerId);
          navigation.navigate('ConsumerScreen');
        } else {
          Alert.alert('Role not recognized', 'Please contact support.');
        }
      } else {
        Alert.alert('Login failed', result.message || 'An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Failed to log in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Again!</Text>
      <Image source={require('../assets/Screenshot_2024-10-29_020411-removebg-preview.png')} style={styles.image} />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#8A8A8A"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#8A8A8A"
        />
      </View>

      <Text style={styles.forgotPasswordText}>Forget password</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Not a member? <Text onPress={() => navigation.navigate('RegistrationScreen')} style={styles.registerNowText}>Register now</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#E8E8E8' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 40, fontWeight: 'bold', color: '#333' },
  image: { width: 220, height: 220, alignSelf: 'center', marginBottom: 30 },
  inputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: { flex: 1, color: '#333', fontSize: 16 },
  forgotPasswordText: { textAlign: 'right', color: '#333', marginBottom: 20, fontWeight: '500' },
  button: {
    backgroundColor: '#36A4A4',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  registerText: { color: '#333', textAlign: 'center', fontSize: 14 },
  registerNowText: { color: '#36A4A4', fontWeight: '500' },
});

export default LoginScreen;
