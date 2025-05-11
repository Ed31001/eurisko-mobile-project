import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Image, TouchableOpacity, View, Dimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigator/navigator';
import useProductDetailsScreenStyles from '../styles/ProductDetailsScreenStyles';

type ProductDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = () => {
  const route = useRoute<ProductDetailsScreenRouteProp>();
  const { title, description, imageUrl, price } = route.params;
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

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.container,
        isPortrait ? styles.scrollViewContentPortrait : styles.scrollViewContentLandscape,
      ]}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>Price: ${price}</Text>
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
