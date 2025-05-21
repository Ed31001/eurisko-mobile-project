import React, { useEffect } from 'react';
import { FlatList, View, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import ProductItem from '../molecules/ProductItem';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigation/navigator/navigator';
import styles from '../../styles/ProductListStyles';
import { useThemeStore } from '../../store/useThemeStore';
import { useProductStore } from '../../store/useProductStore';

const ProductList = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeStore((state) => state.theme);
  const { products, loading, fetchProducts, loadMoreProducts, refreshProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getFullImageUrl = (relativeUrl: string) => {
    if (!relativeUrl){ return ''; }

    const cleanPath = relativeUrl
      .replace(/^\/+/, '')
      .replace(/^api\//, '');

    return `https://backend-practice.eurisko.me/${cleanPath}`;
  };

  const renderFooter = () => {
    if (!loading){ return null; }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={theme.buttonBackground} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const originalUrl = item.images[0]?.url || '';
          const imageUrl = getFullImageUrl(originalUrl);

          console.log('Original URL:', originalUrl);
          console.log('Constructed URL:', imageUrl);

          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  title: item.title,
                  description: item.description,
                  imageUrl: imageUrl,
                  price: item.price,
                })
              }
            >
              <ProductItem
                title={item.title}
                price={item.price}
                imageUrl={imageUrl}
              />
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshProducts}
            colors={[theme.buttonBackground]}
            tintColor={theme.buttonBackground}
          />
        }
      />
    </View>
  );
};

export default ProductList;
