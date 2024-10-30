import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
<View style={styles.container}>
      <Text style={styles.title}>WELCOME</Text>
      <Text style={styles.subtitle}>AGRO-WASTE</Text>

      {/* Circle image */}
      <View style={styles.circleImage}>
        {/* Placeholder images inside the circle */}
        <Image style={styles.userImage} source={require('../src/WhatsApp_Image_2024-10-26_at_15.22.47_15ecc98e-removebg-preview.png')} />

      </View>

      <Text style={styles.description}>
        Transforming agro-waste to valuable resources for{' '}
        <Text style={styles.boldText}>sustainable Farms and Organic fertilizer</Text>
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.signInButton]}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('RegistrationScreen')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9d9d9',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  time: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
  },
  circleImage: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  userImage: {
    width: 280,
    height: 280,
    borderRadius: 140,
    position: 'absolute',
    marginTop:90,
  },
  description: {
    fontSize: 21,
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
    marginTop:50,
  

  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop:90,
  
  },
  button: {
    width: '40%',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#000',
    marginHorizontal: 5,
  },
  signInButton: {
    backgroundColor: '#000',
  },
  registerButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default WelcomeScreen;
