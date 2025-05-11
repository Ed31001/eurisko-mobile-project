import { StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  listContent: {
    padding: moderateScale(16),
  },
});

export default styles;
