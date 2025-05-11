import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { moderateScale } from '../utils/responsive';

const useSignUpScreenStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: moderateScale(16),
      justifyContent: 'center',
    },
    scrollViewContent: {
      flexGrow: 1,
    },
    scrollViewContentPortrait: {
      justifyContent: 'center',
    },
    scrollViewContentLandscape: {
      justifyContent: 'flex-start',
    },
    title: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: moderateScale(24),
      marginBottom: moderateScale(24),
      textAlign: 'center',
      color: theme.textColor,
    },
    input: {
      fontFamily: 'OpenSans-Regular',
      height: moderateScale(50),
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: moderateScale(8),
      paddingHorizontal: moderateScale(12),
      marginBottom: moderateScale(16),
      backgroundColor: theme.inputBackground,
      color: theme.textColor,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: moderateScale(8),
      marginBottom: moderateScale(16),
      backgroundColor: theme.inputBackground,
    },
    passwordInput: {
      flex: 1,
      height: moderateScale(50),
      paddingHorizontal: moderateScale(12),
      color: theme.textColor,
    },
    showPasswordButton: {
      paddingHorizontal: moderateScale(12),
    },
    showPasswordText: {
      color: theme.passwordButton,
      fontWeight: 'bold',
    },
    linkText: {
      fontFamily: 'OpenSans-Regular',
      marginTop: moderateScale(16),
      fontSize: moderateScale(14),
      color: theme.textColor,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
    errorText: {
      fontFamily: 'OpenSans-Regular',
      color: theme.invalidInput,
      fontSize: moderateScale(14),
      marginBottom: moderateScale(8),
    },
    errorInput: {
      borderColor: theme.invalidInput,
    },
  });
};

export default useSignUpScreenStyles;
