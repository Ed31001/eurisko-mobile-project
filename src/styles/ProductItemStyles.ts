import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { moderateScale } from '../utils/responsive';

const useProductItemStyles = () => {
  const { theme } = useTheme();

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
    image: {
      width: moderateScale(120),
      height: moderateScale(120),
    },
    info: {
      flex: 1,
      padding: moderateScale(8),
      justifyContent: 'center',
    },
    title: {
      fontSize: moderateScale(16),
      fontWeight: 'bold',
      marginBottom: moderateScale(4),
      color: theme.textColor,
    },
    price: {
      fontSize: moderateScale(14),
      color: theme.textColor,
    },
  });
};

export default useProductItemStyles;
