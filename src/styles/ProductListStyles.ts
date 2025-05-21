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
  footer: {
    paddingVertical: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
