import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const useButtonStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    button: {
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
      paddingHorizontal: 16,
      backgroundColor: theme.buttonBackground,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};

export default useButtonStyles;
