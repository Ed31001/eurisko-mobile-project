import React, { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { Modal, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useProductStore } from '../../store/useProductStore';
import { useProductListHeaderStyles } from '../../styles/ProductListHeaderStyles';
import { CancelButton, SearchButton } from './SearchModal';

const ProductListHeader = React.memo(forwardRef((props, ref) => {
  const theme = useThemeStore((state) => state.theme);
  const styles = useProductListHeaderStyles();
  const searchProducts = useProductStore((s) => s.searchProducts);
  const sortProducts = useProductStore((s) => s.sortProducts);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchQueryRef = useRef(searchQuery);

  React.useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  const handleSearch = useCallback(() => {
    searchProducts(searchQueryRef.current.trim());
    setShowSearchModal(false);
    setSearchQuery('');
  }, [searchProducts]);

  const handleSort = (order: 'asc' | 'desc') => {
    sortProducts(order);
    setShowSortModal(false);
  };

  const handleCancel = useCallback(() => {
    setShowSearchModal(false);
    setSearchQuery('');
  }, []);

  useImperativeHandle(ref, () => ({
    showSearch: () => setShowSearchModal(true),
    showSort: () => setShowSortModal(true),
  }));

  return (
    <>
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
              <CancelButton onPress={handleCancel} />
              <SearchButton onPress={handleSearch} />
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
    </>
  );
}));

export default ProductListHeader;
