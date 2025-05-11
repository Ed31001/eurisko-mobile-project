import React from 'react';
import ProductList from '../components/organisms/ProductList';
import { View } from 'react-native';
import styles from '../styles/ProductListScreenStyles';

const ProductListScreen = () => {

  return (
    <View style={styles.container}>
      <ProductList />
    </View>
  );
};

export default ProductListScreen;
