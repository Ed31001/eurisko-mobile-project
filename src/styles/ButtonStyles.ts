import { StyleSheet } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { moderateScale } from '../utils/responsive';

const useButtonStyles = () => {
  const theme = useThemeStore((state) => state.theme);

  return StyleSheet.create({
    button: {
      height: moderateScale(50),
      borderRadius: moderateScale(8),
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: moderateScale(16),
      paddingHorizontal: moderateScale(16),
      backgroundColor: theme.buttonBackground,
    },
    buttonText: {
      fontFamily: 'OpenSans-Regular',
      color: theme.buttonText,
      fontSize: moderateScale(16),
      fontWeight: 'bold',
    },
  });
};

export default useButtonStyles;
