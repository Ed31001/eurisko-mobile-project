import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const useSignUpScreenStyles = () => {
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
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: theme.inputBackground,
    },
    passwordInput: {
      flex: 1,
      height: 50,
      paddingHorizontal: 12,
      color: theme.textColor,
    },
    showPasswordButton: {
      paddingHorizontal: 12,
    },
    showPasswordText: {
      color: theme.passwordButton,
      fontWeight: 'bold',
    },
    linkText: {
      marginTop: 16,
      fontSize: 14,
      color: theme.textColor,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
    errorText: {
      color: theme.invalidInput,
      fontSize: 14,
      marginBottom: 8,
    },
    errorInput: {
      borderColor: theme.invalidInput,
    },
  });
};

export default useSignUpScreenStyles;
