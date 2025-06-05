import { StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';
import { useThemeStore } from '../store/useThemeStore';

const useSearchModalStyles = () => {
  const theme = useThemeStore((state) => state.theme);

  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '80%',
      padding: moderateScale(20),
      borderRadius: moderateScale(10),
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
    },
    searchInput: {
      width: '100%',
      height: moderateScale(40),
      borderWidth: 1,
      borderRadius: moderateScale(8),
      paddingHorizontal: moderateScale(10),
      marginBottom: moderateScale(10),
      backgroundColor: theme.inputBackground,
      color: theme.textColor,
      borderColor: theme.borderColor,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: moderateScale(10),
    },
    cancelButton: {
      padding: moderateScale(10),
      borderRadius: moderateScale(8),
      minWidth: '45%',
      alignItems: 'center',
      backgroundColor: theme.buttonBackground,
      marginRight: moderateScale(5),
    },
    cancelButtonText: {
      color: theme.buttonText,
      fontSize: moderateScale(16),
    },
    searchButton: {
      padding: moderateScale(10),
      borderRadius: moderateScale(8),
      minWidth: '45%',
      alignItems: 'center',
      backgroundColor: theme.buttonBackground,
      marginLeft: moderateScale(5),
    },
    searchButtonText: {
      color: theme.buttonText,
      fontSize: moderateScale(16),
    },
  });
};

export default useSearchModalStyles;
