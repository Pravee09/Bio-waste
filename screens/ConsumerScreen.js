import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ConsumerScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/Screenshot 2024-10-29 024930.png')} // Add the path to your background image here
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Consumer Dashboard</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('BrowseProductsScreen')}
        >
          <Icon name="view-list" size={30} color="#4CAF50" />
          <Text style={styles.cardText}>Browse Wastes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ConsumerClaimsScreen')}
        >
          <Icon name="check-circle" size={30} color="#2196F3" />
          <Text style={styles.cardText}>My Claims</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ConsumerProfileScreen')}
        >
          <Icon name="account-circle" size={30} color="#FF5722" />
          <Text style={styles.cardText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Icon name="logout" size={30} color="#F44336" />
          <Text style={styles.cardText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
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
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Glassmorphic effect
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  cardText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#fff',
  },
});

export default ConsumerScreen;
