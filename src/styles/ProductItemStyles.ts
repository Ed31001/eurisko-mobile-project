import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const useProductItemStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: theme.cardBackground,
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
      elevation: 3,
      borderColor: theme.borderColor,
      borderWidth: 1,
    },
    image: {
      width: 120,
      height: 120,
    },
    info: {
      flex: 1,
      padding: 8,
      justifyContent: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color: theme.textColor,
    },
    price: {
      fontSize: 14,
      color: theme.textColor,
    },
  });
};

export default useProductItemStyles;
