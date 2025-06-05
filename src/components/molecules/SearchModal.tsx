import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import useSearchModalStyles from '../../styles/SearchModalStyles';

export const CancelButton = React.memo(({ onPress }: { onPress: () => void }) => {
  const styles = useSearchModalStyles();
  return (
    <TouchableOpacity style={styles.cancelButton} onPress={onPress}>
      <Text style={styles.cancelButtonText}>Cancel</Text>
    </TouchableOpacity>
  );
});

export const SearchButton = React.memo(({ onPress }: { onPress: () => void }) => {
  const styles = useSearchModalStyles();
  return (
    <TouchableOpacity style={styles.searchButton} onPress={onPress}>
      <Text style={styles.searchButtonText}>Search</Text>
    </TouchableOpacity>
  );
});
