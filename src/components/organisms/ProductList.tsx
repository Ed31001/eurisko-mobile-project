import React, { useEffect } from 'react';
import { FlatList, View, TouchableOpacity, RefreshControl, Text } from 'react-native';
import ProductItem from '../molecules/ProductItem';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigation/navigator/navigator';
import styles from '../../styles/ProductListStyles';
import { useThemeStore } from '../../store/useThemeStore';
import { useProductStore } from '../../store/useProductStore';

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
  } = useProductStore();

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

  const renderPaginationControls = () => (
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
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const imageUrl = getFullImageUrl(item.images[0]?.url || '');
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
        ListHeaderComponent={renderPaginationControls}
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
