import { StyleSheet } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { moderateScale } from '../utils/responsive';

const useProductFormScreenStyles = () => {
  const theme = useThemeStore((state) => state.theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    content: {
      padding: moderateScale(16),
      paddingBottom: moderateScale(32),
    },
    imagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: moderateScale(16),
    },
    imageContainer: {
      position: 'relative',
      marginRight: moderateScale(8),
      marginBottom: moderateScale(8),
    },
    image: {
      width: moderateScale(80),
      height: moderateScale(80),
      borderRadius: moderateScale(8),
      backgroundColor: theme.inputBackground,
    },
    removeImageButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.invalidInput,
      borderRadius: 12,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    removeImageText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    addImageButton: {
      width: moderateScale(80),
      height: moderateScale(80),
      borderRadius: moderateScale(8),
      backgroundColor: theme.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.buttonBackground,
    },
    addImageText: {
      fontSize: 32,
      color: theme.buttonBackground,
      fontWeight: 'bold',
    },
    input: {
      backgroundColor: theme.inputBackground,
      color: theme.textColor,
      borderRadius: 8,
      padding: moderateScale(12),
      marginBottom: moderateScale(12),
      fontSize: moderateScale(16),
    },
    textArea: {
      backgroundColor: theme.inputBackground,
      color: theme.textColor,
      borderRadius: 8,
      padding: moderateScale(12),
      marginBottom: moderateScale(12),
      fontSize: moderateScale(16),
      minHeight: moderateScale(80),
      textAlignVertical: 'top',
    },
    errorInput: {
      borderWidth: 1,
      borderColor: theme.invalidInput,
    },
    errorText: {
      color: theme.invalidInput,
      marginBottom: moderateScale(8),
      fontSize: moderateScale(14),
    },
    locationContainer: {
      marginBottom: moderateScale(16),
    },
    locationInput: {
      marginBottom: moderateScale(8),
    },
    map: {
      width: '100%',
      height: moderateScale(150),
      borderRadius: 8,
      marginBottom: moderateScale(8),
    },
    locationText: {
      color: theme.textColor,
      fontSize: moderateScale(14),
      marginBottom: moderateScale(8),
    },
    submitButton: {
      backgroundColor: theme.buttonBackground,
      borderRadius: 8,
      paddingVertical: moderateScale(14),
      alignItems: 'center',
      marginTop: moderateScale(8),
    },
    submitButtonText: {
      color: theme.buttonText,
      fontSize: moderateScale(16),
      fontWeight: 'bold',
    },
    disabledButton: {
      opacity: 0.6,
    },
  });
};

export default useProductFormScreenStyles;
