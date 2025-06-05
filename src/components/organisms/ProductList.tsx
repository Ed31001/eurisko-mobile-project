import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { FlatList, View, TouchableOpacity, RefreshControl, Text, Animated } from 'react-native';
import ProductItem from '../molecules/ProductItem';
import SkeletonItem from '../atoms/SkeletonItem';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigation/navigator/navigator';
import { useProductListStyles } from '../../styles/ProductListStyles';
import { useThemeStore } from '../../store/useThemeStore';
import { useProductStore } from '../../store/useProductStore';

type Product = {
  _id: string;
  title: string;
  price: number;
  images: Array<{ url: string }>;
};

const ProductList = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useThemeStore((state) => state.theme);
  const {
    products,
    loading,
    currentPage,
    totalPages,
    fetchProducts,
    loadNextPage,
    loadPreviousPage,
    refreshProducts,
    error,
  } = useProductStore();

  const styles = useProductListStyles();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRefresh = useCallback(async () => {
    try {
      await refreshProducts();
    } catch (err) {
      console.error('Refresh error:', err);
    }
  }, [refreshProducts]);

  const getFullImageUrl = useCallback((relativeUrl: string) => {
    if (!relativeUrl){ return ''; }
    const cleanPath = relativeUrl
      .replace(/^\/+/, '')
      .replace(/^api\//, '');
    return `https://backend-practice.eurisko.me/${cleanPath}`;
  }, []);

  const renderPaginationControls = useCallback(() => (
    <View style={styles.paginationControls}>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === 1 && styles.paginationButtonDisabled,
        ]}
        onPress={loadPreviousPage}
        disabled={currentPage === 1}
      >
        <Text style={[
          styles.paginationButtonText,
          currentPage === 1 && styles.paginationButtonTextDisabled,
        ]}>Previous</Text>
      </TouchableOpacity>

      <Text style={[styles.paginationText, { color: theme.textColor }]}>
        Page {currentPage} of {totalPages}
      </Text>

      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === totalPages && styles.paginationButtonDisabled,
        ]}
        onPress={loadNextPage}
        disabled={currentPage === totalPages}
      >
        <Text style={[
          styles.paginationButtonText,
          currentPage === totalPages && styles.paginationButtonTextDisabled,
        ]}>Next</Text>
      </TouchableOpacity>
    </View>
  ), [
    styles,
    currentPage,
    totalPages,
    loadPreviousPage,
    loadNextPage,
    theme.textColor,
  ]);

  const renderSkeletonLoading = useCallback(() => (
    <View style={styles.container}>
      {[...Array(6)].map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </View>
  ), [styles.container]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (products.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [products, fadeAnim]);

  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => {
      const imageUrl = getFullImageUrl(item.images[0]?.url || '');
      return (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50 * (index + 1), 0],
              }),
            }],
          }}
        >
          <ProductItem
            title={item.title}
            price={item.price}
            imageUrl={imageUrl}
            onPress={() => navigation.navigate('ProductDetails', { id: item._id })}
          />
        </Animated.View>
      );
    },
    [fadeAnim, getFullImageUrl, navigation]
  );

  const listContentStyle = useMemo(() => styles.listContent, [styles.listContent]);

  if (loading && !products.length) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <FlatList
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={renderPaginationControls}
          ListFooterComponent={renderSkeletonLoading}
          contentContainerStyle={listContentStyle}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <FlatList
          data={[]}
          renderItem={() => null}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={[theme.buttonBackground]}
              tintColor={theme.buttonBackground}
            />
          }
          ListHeaderComponent={
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {error}. Pull down to retry.
              </Text>
            </View>
          }
          contentContainerStyle={listContentStyle}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={listContentStyle}
        ListHeaderComponent={renderPaginationControls}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[theme.buttonBackground]}
            tintColor={theme.buttonBackground}
          />
        }
      />
    </View>
  );
};

export default ProductList;
