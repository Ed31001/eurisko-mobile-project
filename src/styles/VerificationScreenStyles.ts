import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const useVerificationScreenStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    content: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
      color: theme.textColor,
    },
    input: {
      height: 50,
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
      backgroundColor: theme.inputBackground,
      color: theme.textColor,
      textAlign: 'center',
      fontSize: 18,
      letterSpacing: 8,
    },
  });
};

export default useVerificationScreenStyles;
