import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductListScreen from '../../screens/ProductListScreen';
import ProductDetailsScreen from '../../screens/ProductDetailsScreen';
import ThemeToggle from '../../components/atoms/ThemeToggle';
import { useThemeStore } from '../../store/useThemeStore';
import ProductListHeader from '../../components/molecules/ProductListHeader';

const Stack = createNativeStackNavigator();

const ProductStack = () => {
  const theme = useThemeStore((state) => state.theme);
  const renderThemeToggle = () => <ThemeToggle />;

  return (
    <Stack.Navigator
      initialRouteName="ProductList"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTintColor: theme.buttonText,
        headerTitleStyle: {
          fontFamily: 'Roboto-Bold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        headerRight: renderThemeToggle,
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: 'Products',
          headerLeft: ProductListHeader,
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
  );
};

export default ProductStack;
