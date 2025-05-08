import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type ProductItemProps = {
  title: string;
  price: number;
  imageUrl: string;
};

const ProductItem = ({ title, price, imageUrl }: ProductItemProps) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
  },
  info: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
});

export default ProductItem;
