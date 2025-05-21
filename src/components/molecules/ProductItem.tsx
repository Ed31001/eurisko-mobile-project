import React, { useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import useProductItemStyles from '../../styles/ProductItemStyles';
import { useThemeStore } from '../../store/useThemeStore';

type ProductItemProps = {
  title: string;
  price: number;
  imageUrl: string;
};

const ProductItem = ({ title, price, imageUrl }: ProductItemProps) => {
  const styles = useProductItemStyles();
  const theme = useThemeStore((state) => state.theme);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleImageError = (_error: any) => {
    console.error('Failed to load image:', imageUrl);
    setImageError(true);
    setLoading(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {!imageError ? (
          <Image
            source={{
              uri: imageUrl,
              headers: {
                Accept: 'image/*',
              },
            }}
            style={styles.image}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={handleImageError}
          />
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>!</Text>
          </View>
        )}
        {loading && (
          <ActivityIndicator
            size="large"
            color={theme.buttonBackground}
            style={styles.loader}
          />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
    </View>
  );
};

export default ProductItem;
