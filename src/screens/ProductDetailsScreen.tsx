import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Image, TouchableOpacity, View, Dimensions, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigator/navigator';
import useProductDetailsScreenStyles from '../styles/ProductDetailsScreenStyles';
import { useProductStore } from '../store/useProductStore';

type ProductDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = () => {
  const route = useRoute<ProductDetailsScreenRouteProp>();
  const { id } = route.params;
  const { getProductById, selectedProduct, loading, error } = useProductStore();
  const styles = useProductDetailsScreenStyles();
  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    const onChange = ({ window }: { window: { width: number; height: number } }) => {
      setIsPortrait(window.height >= window.width);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    onChange({ window: Dimensions.get('window') });
    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    getProductById(id);
  }, [id, getProductById]); // Added getProductById to dependencies

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error || !selectedProduct) {
    return <Text style={styles.errorText}>{error || 'Product not found'}</Text>;
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.container,
        isPortrait ? styles.scrollViewContentPortrait : styles.scrollViewContentLandscape,
      ]}
    >
      <Image
        source={{ uri: selectedProduct.images[0]?.url }}
        style={styles.image}
      />
      <Text style={styles.title}>{selectedProduct.title}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
      <Text style={styles.price}>Price: ${selectedProduct.price}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetailsScreen;
