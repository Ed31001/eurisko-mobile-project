import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductStackParamList } from '../navigator/navigator';
import ProductListScreen from '../../screens/ProductListScreen';
import ProductDetailsScreen from '../../screens/ProductDetailsScreen';
import AddProductScreen from '../../screens/AddProductScreen';
import ThemeToggle from '../../components/atoms/ThemeToggle';
import { useThemeStore } from '../../store/useThemeStore';
import ProductListHeader from '../../components/molecules/ProductListHeader';

const Stack = createNativeStackNavigator<ProductStackParamList>();

const HeaderLeft = () => <ProductListHeader />;
const HeaderRight = () => <ThemeToggle />;

const ProductStack = () => {
  const theme = useThemeStore((state) => state.theme);

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
        headerRight: HeaderRight,
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: 'Products',
          headerLeft: HeaderLeft,
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          title: 'Product Details',
        }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          title: 'Add Product',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProductStack;
