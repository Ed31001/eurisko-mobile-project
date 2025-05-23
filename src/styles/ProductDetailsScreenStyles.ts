import { StyleSheet } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { moderateScale } from '../utils/responsive';

const useProductDetailsScreenStyles = () => {
  const theme = useThemeStore((state) => state.theme);

  return StyleSheet.create({
    errorText: {
      fontSize: 16,
      color: 'red',
      textAlign: 'center',
      margin: 20,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollView: {
      flex: 1,
    },
    container: {
      flexGrow: 1,
      padding: moderateScale(16),
      backgroundColor: theme.backgroundColor,
    },
    scrollViewContentPortrait: {
      justifyContent: 'center',
    },
    scrollViewContentLandscape: {
      justifyContent: 'flex-start',
    },
    image: {
      width: '100%',
      height: moderateScale(400),
      borderRadius: moderateScale(8),
      marginBottom: moderateScale(16),
    },
    title: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: moderateScale(24),
      marginBottom: moderateScale(8),
      color: theme.textColor,
    },
    description: {
      fontFamily: 'OpenSans-Regular',
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
      fontFamily: 'OpenSans-Regular',
      color: theme.buttonText,
      fontSize: moderateScale(16),
      fontWeight: 'bold',
    },
  });
};

export default useProductDetailsScreenStyles;
