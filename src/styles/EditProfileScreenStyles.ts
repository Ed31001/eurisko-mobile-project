import { StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';
import { useThemeStore } from '../store/useThemeStore';

const useEditProfileScreenStyles = () => {
  const theme = useThemeStore((state) => state.theme);

  return StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    container: {
      padding: moderateScale(16),
      alignItems: 'center',
    },
    imageContainer: {
      width: moderateScale(150),
      height: moderateScale(150),
      borderRadius: moderateScale(75),
      marginBottom: moderateScale(24),
      alignSelf: 'center',
      position: 'relative',
      backgroundColor: theme.cardBackground,
      overflow: 'hidden',
    },
    profileImage: {
      width: '100%',
      height: '100%',
      borderRadius: moderateScale(75),
    },
    placeholderContainer: {
      width: '100%',
      height: '100%',
      borderRadius: moderateScale(75),
      backgroundColor: theme.buttonBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      color: theme.buttonText,
      fontSize: moderateScale(40),
      fontFamily: 'Roboto-Bold',
    },
    editIconContainer: {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: [{ translateX: -moderateScale(16) }],
      width: moderateScale(32),
      height: moderateScale(32),
      borderRadius: moderateScale(16),
      backgroundColor: theme.buttonBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editIconText: {
      color: theme.buttonText,
      fontSize: moderateScale(16),
    },
    inputContainer: {
      width: '100%',
      marginBottom: moderateScale(16),
    },
    label: {
      fontSize: moderateScale(16),
      marginBottom: moderateScale(8),
      color: theme.textColor,
    },
    input: {
      height: moderateScale(50),
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: moderateScale(8),
      paddingHorizontal: moderateScale(16),
      backgroundColor: theme.inputBackground,
      color: theme.textColor,
    },
    loader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
  });
};

export default useEditProfileScreenStyles;
