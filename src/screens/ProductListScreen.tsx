import React from 'react';
import ProductList from '../components/organisms/ProductList';
import { View } from 'react-native';
import styles from '../styles/ProductListScreenStyles';
import { useFocusEffect } from '@react-navigation/native';
import { logScreenView } from '../utils/firebase';

const ProductListScreen = () => {
  useFocusEffect(
    React.useCallback(() => {
      logScreenView('ProductList', 'ProductList');
    }, [])
  );

  return (
    <View style={styles.container}>
      <ProductList />
    </View>
  );
};

export default ProductListScreen;
