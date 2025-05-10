import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const useProductDetailsScreenStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.backgroundColor,
    },
    image: {
      width: '100%',
      height: 400,
      borderRadius: 8,
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.textColor,
    },
    description: {
      fontSize: 16,
      color: theme.textColor,
      marginBottom: 16,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 24,
      color: theme.textColor,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      height: 50,
      backgroundColor: theme.buttonBackground,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 8,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};

export default useProductDetailsScreenStyles;
