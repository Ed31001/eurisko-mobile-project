import { StyleSheet } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { moderateScale } from '../utils/responsive';

const useProductItemStyles = () => {
  const theme = useThemeStore((state) => state.theme);

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: theme.cardBackground,
      borderRadius: moderateScale(8),
      marginBottom: moderateScale(16),
      overflow: 'hidden',
      elevation: 3,
      borderColor: theme.borderColor,
      borderWidth: 1,
    },
    imageContainer: {
      width: moderateScale(120),
      height: moderateScale(120),
      position: 'relative',
      backgroundColor: theme.inputBackground,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    loader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
    },
    errorText: {
      color: theme.invalidInput,
      fontSize: moderateScale(24),
      fontWeight: 'bold',
    },
    info: {
      flex: 1,
      padding: moderateScale(8),
      justifyContent: 'center',
    },
    title: {
      fontFamily: 'OpenSans-Regular',
      fontSize: moderateScale(16),
      fontWeight: 'bold',
      marginBottom: moderateScale(4),
      color: theme.textColor,
    },
    price: {
      fontFamily: 'OpenSans-Regular',
      fontSize: moderateScale(14),
      color: theme.textColor,
    },
  });
};

export default useProductItemStyles;
