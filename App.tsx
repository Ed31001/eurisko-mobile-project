import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import VerificationScreen from './src/screens/VerificationScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import { AuthProvider } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SignUp"
          screenOptions={{
            headerStyle: { backgroundColor: 'blue' }, // Change header background color
            headerTintColor: '#fff', // Change header text color
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 }, // Customize header title font
            headerTitleAlign: 'center', // Center-align the title
          }}
        >
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              title: 'Welcome',
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Welcome Back',
            }}
          />
          <Stack.Screen
            name="Verification"
            component={VerificationScreen}
            options={{
              title: 'Verify your Account',
            }}
          />
          <Stack.Screen
            name="ProductList"
            component={ProductListScreen}
            options={{
              title: 'Products',
            }}
          />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
            options={{
              title: 'Product Details',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
