import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import NavBar from '../components/organisms/NavBar';
import ProductItem from '../components/molecules/ProductItem';
import products from '../../Products.json';

const ProductListScreen = () => {
  return (
    <View style={styles.container}>
      <NavBar
        title="Products"
        onLeftPress={() => console.log('Left button pressed')}
        onRightPress={() => console.log('Right button pressed')}
      />
      <FlatList
        data={products.data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ProductItem
            title={item.title}
            price={item.price}
            imageUrl={item.images[0]?.url || ''}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  listContent: {
    padding: 16,
  },
});

export default ProductListScreen;
