import React, { useState, useRef } from 'react';
import { View, Text, Image, ActivityIndicator, Animated, TouchableOpacity } from 'react-native';
import useProductItemStyles from '../../styles/ProductItemStyles';
import { useThemeStore } from '../../store/useThemeStore';

type ProductItemProps = {
  title: string;
  price: number;
  imageUrl: string;
  onPress: () => void;
};

const ProductItem = ({ title, price, imageUrl, onPress }: ProductItemProps) => {
  const styles = useProductItemStyles();
  const theme = useThemeStore((state) => state.theme);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 50,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleImageError = (_error: any) => {
    console.error('Failed to load image:', imageUrl);
    setImageError(true);
    setLoading(false);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.imageContainer}>
          {!imageError ? (
            <Image
              source={{
                uri: imageUrl,
                headers: { Accept: 'image/*' },
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
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ProductItem;
