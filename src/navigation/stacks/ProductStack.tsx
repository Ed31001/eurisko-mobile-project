import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductListScreen from '../../screens/ProductListScreen';
import ProductDetailsScreen from '../../screens/ProductDetailsScreen';
import HeaderLeftLogoutButton from '../../components/molecules/LogoutButton';
import ThemeToggle from '../../components/atoms/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { moderateScale } from '../../utils/responsive';

const Stack = createNativeStackNavigator();

const ProductStack = () => {
  const { theme } = useTheme();

  const renderThemeToggle = () => <ThemeToggle />;

  return (
    <Stack.Navigator
      initialRouteName="ProductList"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerBackground,
          height: moderateScale(40),
        },
        headerTintColor: theme.buttonText,
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18, lineHeight: 22 },
        headerTitleAlign: 'center',
        headerTitleContainerStyle: { marginVertical: 0, paddingVertical: 0 },
        headerRight: renderThemeToggle,
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: 'Products',
          headerBackVisible: false,
          headerLeft: HeaderLeftLogoutButton,
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
