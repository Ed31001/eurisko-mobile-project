import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { moderateScale } from '../utils/responsive';

const useProductDetailsScreenStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: moderateScale(16),
      backgroundColor: theme.backgroundColor,
    },
    image: {
      width: '100%',
      height: moderateScale(400),
      borderRadius: moderateScale(8),
      marginBottom: moderateScale(16),
    },
    title: {
      fontSize: moderateScale(24),
      fontWeight: 'bold',
      marginBottom: moderateScale(8),
      color: theme.textColor,
    },
    description: {
      fontSize: moderateScale(16),
      color: theme.textColor,
      marginBottom: moderateScale(16),
    },
    price: {
      fontSize: moderateScale(18),
      fontWeight: 'bold',
      marginBottom: moderateScale(24),
      color: theme.textColor,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      height: moderateScale(50),
      backgroundColor: theme.buttonBackground,
      borderRadius: moderateScale(8),
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: moderateScale(8),
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: moderateScale(16),
      fontWeight: 'bold',
    },
  });
};

export default useProductDetailsScreenStyles;
