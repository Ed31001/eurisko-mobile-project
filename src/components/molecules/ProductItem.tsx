import React from 'react';
import { View, Text, Image } from 'react-native';
import useProductItemStyles from '../../styles/ProductItemStyles';

type ProductItemProps = {
  title: string;
  price: number;
  imageUrl: string;
};

const ProductItem = ({ title, price, imageUrl }: ProductItemProps) => {
  const styles = useProductItemStyles();

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

export default ProductItem;
