import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import LoginScreen from '../screens/LoginScreen';
import ConsumerScreen from '../screens/ConsumerScreen';
import ProducerScreen from '../screens/ProducerScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ViewProductsScreen from '../screens/ViewProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import BrowseProductsScreen from '../screens/BrowseProductsScreen';
import ConsumerProductDetails from '../screens/ConsumerProductDetails';
import ConsumerClaimsScreen from '../screens/ConsumerClaimsScreen';
import ClaimedProductDetailsScreen from '../screens/ClaimedProductDetailsScreen';
import ConsumerProfileScreen from '../screens/ConsumerProfileScreen';
import ProducerProfileScreen from '../screens/ProducerProfileScreen';
import ProducerClaimsScreen from '../screens/ProducerClaimsScreen';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="ConsumerScreen" component={ConsumerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProducerScreen" component={ProducerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddProductScreen" component={AddProductScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="ViewProductsScreen" component={ViewProductsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="BrowseProductsScreen" component={BrowseProductsScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="ConsumerProductDetails" component={ConsumerProductDetails} options={{ headerShown: false }} />
        <Stack.Screen name="ConsumerClaimsScreen" component={ConsumerClaimsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ClaimedProductDetailsScreen" component={ClaimedProductDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ConsumerProfileScreen"component={ConsumerProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="ProducerProfileScreen" component={ProducerProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProducerClaimsScreen" component={ProducerClaimsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
