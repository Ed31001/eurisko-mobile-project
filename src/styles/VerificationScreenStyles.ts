import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { moderateScale } from '../utils/responsive';

const useVerificationScreenStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    content: {
      flex: 1,
      padding: moderateScale(16),
      justifyContent: 'center',
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
      textAlign: 'center',
      fontSize: moderateScale(18),
      letterSpacing: moderateScale(8),
    },
  });
};

export default useVerificationScreenStyles;
