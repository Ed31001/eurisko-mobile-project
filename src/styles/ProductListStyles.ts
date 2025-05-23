import { StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';
import { useThemeStore } from '../store/useThemeStore';

export const useProductListStyles = () => {
  const theme = useThemeStore((state) => state.theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    listContent: {
      padding: moderateScale(16),
    },
    footer: {
      paddingVertical: moderateScale(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    paginationControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: moderateScale(10),
      marginBottom: moderateScale(10),
    },
    paginationButton: {
      backgroundColor: theme.buttonBackground,
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(8),
      borderRadius: moderateScale(5),
    },
    paginationButtonDisabled: {
      backgroundColor: theme.disabledButton,
      opacity: 0.5,
    },
    paginationButtonText: {
      color: theme.buttonText,
      fontSize: moderateScale(14),
      fontWeight: 'bold',
    },
    paginationButtonTextDisabled: {
      color: theme.disabledText,
    },
    paginationText: {
      fontSize: moderateScale(14),
      color: theme.textColor,
    },
    errorText: {
      fontSize: moderateScale(16),
      color: theme.invalidInput,
      textAlign: 'center',
      marginTop: moderateScale(20),
      fontFamily: 'OpenSans-Regular',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(20),
    },
  });
};
