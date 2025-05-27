import { StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: moderateScale(16),
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
  image: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(8),
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(12),
    justifyContent: 'center',
  },
  title: {
    height: moderateScale(20),
    borderRadius: moderateScale(4),
    marginBottom: moderateScale(8),
    width: '80%',
  },
  price: {
    height: moderateScale(16),
    borderRadius: moderateScale(4),
    width: '40%',
  },
});

export default styles;
