import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProductStackNavigationProp } from '../../navigation/navigator/navigator';
import { useThemeStore } from '../../store/useThemeStore';
import { useProductListHeaderStyles } from '../../styles/ProductListHeaderStyles';

const ProductListHeaderButtons = React.memo(({ onShowSearch, onShowSort }: {
  onShowSearch: () => void;
  onShowSort: () => void;
}) => {
  const navigation = useNavigation<ProductStackNavigationProp>();
  const theme = useThemeStore((state) => state.theme);
  const styles = useProductListHeaderStyles();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onShowSearch}
        style={[styles.button, { backgroundColor: theme.buttonBackground }]}
      />
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onShowSort}
        style={[styles.button, { backgroundColor: theme.buttonBackground }]}
      />
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => navigation.navigate('AddProduct')}
        style={[styles.button, { backgroundColor: theme.buttonBackground }]}
      />
    </View>
  );
});

export default ProductListHeaderButtons;
