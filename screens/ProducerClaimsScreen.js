// ProducerClaimsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProducerClaimsScreen = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const producerId = await AsyncStorage.getItem('producerId');
      if (!producerId) {
        Alert.alert('Error', 'Producer ID not found. Please log in again.');
        return;
      }

      const response = await fetch(`http://10.100.53.34:5000/api/claims/producer/${producerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch claims');
      }

      const data = await response.json();
      setClaims(data);
    } catch (error) {
      console.error('Error fetching claims:', error);
      Alert.alert('Error', 'Failed to load claims.');
    }
  };

  const renderClaim = ({ item }) => (
    <View style={styles.claimCard}>
      <Text style={styles.consumerName}>Consumer: {item.consumerName}</Text>
      <Text>Contact: {item.consumerMobile}</Text>
      <Text>Product: {item.productName}</Text>
      <Text>Claimed on: {new Date(item.claimedAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <FlatList
      data={claims}
      renderItem={renderClaim}
      keyExtractor={(item) => item.claimId}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  claimCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  consumerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProducerClaimsScreen;
