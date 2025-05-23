import { StyleSheet } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { moderateScale } from '../utils/responsive';

const useEditProductScreenStyles = () => {
  const theme = useThemeStore((state) => state.theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    content: {
      padding: moderateScale(16),
    },
    imagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: moderateScale(16),
    },
    imageContainer: {
      width: moderateScale(100),
      height: moderateScale(100),
      margin: moderateScale(4),
      borderRadius: moderateScale(8),
      overflow: 'hidden',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    removeImageButton: {
      position: 'absolute',
      top: moderateScale(4),
      right: moderateScale(4),
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: moderateScale(12),
      width: moderateScale(24),
      height: moderateScale(24),
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeImageText: {
      color: 'white',
      fontSize: moderateScale(16),
    },
    addImageButton: {
      width: moderateScale(100),
      height: moderateScale(100),
      margin: moderateScale(4),
      borderRadius: moderateScale(8),
      borderWidth: 2,
      borderColor: theme.buttonBackground,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addImageText: {
      fontSize: moderateScale(24),
      color: theme.buttonBackground,
    },
    input: {
      height: moderateScale(50),
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: moderateScale(8),
      paddingHorizontal: moderateScale(12),
      marginBottom: moderateScale(16),
      backgroundColor: theme.inputBackground,
      color: theme.textColor,
    },
    textArea: {
      height: moderateScale(100),
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: moderateScale(8),
      paddingHorizontal: moderateScale(12),
      paddingTop: moderateScale(12),
      marginBottom: moderateScale(16),
      backgroundColor: theme.inputBackground,
      color: theme.textColor,
      textAlignVertical: 'top',
    },
    errorInput: {
      borderColor: theme.invalidInput,
    },
    errorText: {
      color: theme.invalidInput,
      fontSize: moderateScale(12),
      marginBottom: moderateScale(8),
    },
    locationContainer: {
      marginBottom: moderateScale(16),
    },
    locationInput: {
      marginBottom: moderateScale(8),
    },
    map: {
      width: '100%',
      height: moderateScale(200),
      borderRadius: moderateScale(8),
    },
    locationText: {
      marginTop: moderateScale(8),
      fontSize: moderateScale(14),
      color: theme.textColor,
    },
    submitButton: {
      backgroundColor: theme.buttonBackground,
      height: moderateScale(50),
      borderRadius: moderateScale(8),
      justifyContent: 'center',
      alignItems: 'center',
    },
    submitButtonText: {
      color: theme.buttonText,
      fontSize: moderateScale(16),
      fontWeight: 'bold',
    },
    disabledButton: {
      opacity: 0.7,
    },
  });
};

export default useEditProductScreenStyles;
