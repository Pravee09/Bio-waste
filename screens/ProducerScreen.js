import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProducerScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userToken');
      Alert.alert('Logout successful');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Logout failed', 'Please try again');
    }
  };

  const icons = [
    { id: 1, image: require('../assets/icon_create.png'), label: 'Create Listing', action: () => navigation.navigate('AddProductScreen') },
    { id: 2, image: require('../assets/icon_view.png'), label: 'View Products', action: () => navigation.navigate('ViewProductsScreen') },
    { id: 3, image: require('../assets/icon_profile.png'), label: 'View Profile', action: () => navigation.navigate('ProducerProfileScreen') },
    { id: 4, image: require('../assets/icon_logout.png'), label: 'Logout', action: handleLogout },
  ];

  return (
    <ImageBackground
      source={require('../assets/bg.jpeg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Product Dashboard</Text>
        <View style={styles.iconContainer}>
          {icons.map((icon) => (
            <TouchableOpacity key={icon.id} onPress={icon.action} style={styles.touchable}>
              <View style={styles.iconBox}>
                <Image source={icon.image} style={styles.iconImage} />
              </View>
              <Text style={styles.iconLabel}>{icon.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF',  // Changed to white
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    alignItems: 'center',
    margin: 15,
    width: 100,
  },
  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  iconLabel: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#FFF',  // Changed to white
  },
});

export default ProducerScreen;
