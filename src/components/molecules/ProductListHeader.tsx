import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput, Modal } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useProductStore } from '../../store/useProductStore';
import { useNavigation } from '@react-navigation/native';
import { ProductStackNavigationProp } from '../../navigation/navigator/navigator';
import styles from '../../styles/ProductListHeaderStyles';

const ProductListHeader = () => {
  const navigation = useNavigation<ProductStackNavigationProp>();
  const theme = useThemeStore((state) => state.theme);
  const { searchProducts, sortProducts } = useProductStore();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    searchProducts(searchQuery.trim());
    setShowSearchModal(false);
    setSearchQuery('');
  };

  const handleSort = (order: 'asc' | 'desc') => {
    sortProducts(order);
    setShowSortModal(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setShowSearchModal(true)}
        style={[styles.button, { backgroundColor: theme.buttonBackground }]}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>🔍</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowSortModal(true)}
        style={[styles.button, { backgroundColor: theme.buttonBackground }]}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>↕️</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('AddProduct')}
        style={[styles.button, { backgroundColor: theme.buttonBackground }]}
      >
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>➕</Text>
      </TouchableOpacity>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <TextInput
              style={[styles.searchInput, {
                backgroundColor: theme.inputBackground,
                color: theme.textColor,
                borderColor: theme.borderColor,
              }]}
              placeholder="Search products..."
              placeholderTextColor={theme.textColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowSearchModal(false)}
                style={[styles.modalButton, { backgroundColor: theme.buttonBackground }]}
              >
                <Text style={[styles.buttonText, { color: theme.buttonText }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSearch}
                style={[styles.modalButton, { backgroundColor: theme.buttonBackground }]}
              >
                <Text style={[styles.buttonText, { color: theme.buttonText }]}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Sort by Price</Text>
            <TouchableOpacity
              onPress={() => handleSort('asc')}
              style={[styles.sortButton, { backgroundColor: theme.buttonBackground }]}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>Low to High ⬆️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSort('desc')}
              style={[styles.sortButton, { backgroundColor: theme.buttonBackground }]}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>High to Low ⬇️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowSortModal(false)}
              style={[styles.modalButton, { backgroundColor: theme.buttonBackground }]}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductListHeader;
