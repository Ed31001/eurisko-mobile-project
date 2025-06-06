import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ProductStackParamList } from '../navigator/navigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductListScreen from '../../screens/ProductListScreen';
import ProductDetailsScreen from '../../screens/ProductDetailsScreen';
import ProductFormScreen from '../../screens/ProductFormScreen';
import CartScreen from '../../screens/CartScreen';
import ThemeToggle from '../../components/atoms/ThemeToggle';
import ProductListHeaderButtons from '../../components/molecules/ProductListHeaderButtons';
import ProductListHeader from '../../components/molecules/ProductListHeader';
import { useThemeStore } from '../../store/useThemeStore';
import { useCartStore } from '../../store/useCartStore';
import { useProductListHeaderStyles } from '../../styles/ProductListHeaderStyles';
import styles from '../../styles/ProductStackStyles';

type ProductStackNavigationProp = NativeStackNavigationProp<ProductStackParamList>;

const Stack = createNativeStackNavigator<ProductStackParamList>();

// Memoized CartButton
const CartButton = React.memo(() => {
  const navigation = useNavigation<ProductStackNavigationProp>();
  const { items } = useCartStore();
  const headerStyles = useProductListHeaderStyles();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Cart')}
      style={headerStyles.button}
    >
      <Text style={headerStyles.buttonText}>
        🛒{items.length > 0 ? ` ${items.length}` : ''}
      </Text>
    </TouchableOpacity>
  );
});

// Define the type for the ref
type ProductListHeaderRef = {
  showSearch: () => void;
  showSort: () => void;
};

// Create the ref with the correct type
const showHeaderModalRef = React.createRef<ProductListHeaderRef>();

const HeaderLeft = () => (
  <>
    <ProductListHeaderButtons
      onShowSearch={() => showHeaderModalRef.current?.showSearch()}
      onShowSort={() => showHeaderModalRef.current?.showSort()}
    />
    <ProductListHeader ref={showHeaderModalRef} />
  </>
);

const renderHeaderRight = () => <MemoizedHeaderRight />;

const MemoizedHeaderRight = React.memo(() => (
  <View style={styles.headerContainer}>
    <CartButton />
    <ThemeToggle />
  </View>
));

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
        headerRight: () => renderHeaderRight(),
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: 'Products',
          headerLeft: HeaderLeft, // not an inline arrow function!
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
        component={ProductFormScreen}
        options={{
          title: 'Add Product',
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={ProductFormScreen}
        options={{
          title: 'Edit Product',
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Shopping Cart',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProductStack;
