import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ConsumerClaimsScreen = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true); // Start loading
    try {
        const consumerId = await AsyncStorage.getItem('consumerId');
        if (!consumerId) {
            Alert.alert('Error', 'Consumer ID not found. Please log in again.');
            return;
        }
  
        console.log('Fetching claims for consumerId:', consumerId);
  
        const response = await fetch(`http://10.100.53.34:5000/api/claims/${consumerId}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch claims: ${errorText}`);
        }
  
        const data = await response.json();
        setClaims(data);
    } catch (error) {
        console.error('Error fetching claims:', error);
        Alert.alert('Error', 'Failed to load claims.');
    } finally {
        setLoading(false); // Stop loading
    }
};

  

  const renderClaim = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ClaimedProductDetailsScreen', { product: item.productId })}>
      <View style={styles.claimCard}>
        {item.productId ? (
          <>
            <Image source={{ uri: `http://10.100.53.34:5000/${item.productId.image}` }} style={styles.productImage} />
            <View style={styles.claimDetails}>
              <Text style={styles.productName}>{item.productId.productName}</Text>
              <Text>Claimed on: {new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.productName}>Product information not available</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={claims}
          renderItem={renderClaim}
          keyExtractor={(item) => item.claimId || item._id}
          ListEmptyComponent={<Text style={styles.emptyText}>No claims available</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  claimCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  claimDetails: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default ConsumerClaimsScreen;
