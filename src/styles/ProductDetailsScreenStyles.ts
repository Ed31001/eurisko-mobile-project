import { StyleSheet } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { moderateScale } from '../utils/responsive';

const useProductDetailsScreenStyles = () => {
  const theme = useThemeStore((state) => state.theme);

  return StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    container: {
      flexGrow: 1,
    },
    scrollViewContentPortrait: {
      flexDirection: 'column',
    },
    scrollViewContentLandscape: {
      flexDirection: 'row',
      minHeight: '100%',
    },
    swiperContainer: {
      backgroundColor: theme.cardBackground,
      aspectRatio: 1,
      // Adjust width based on orientation
      width: '100%',
      flexShrink: 0, // Prevent swiper from shrinking in landscape
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    touchableImage: {
      width: '100%',
      height: '100%',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    imageLoader: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -20 }, { translateY: -20 }],
      backgroundColor: 'transparent',
    },
    swiperButton: {
      color: theme.buttonText,
      fontSize: moderateScale(44),
      fontWeight: 'bold',
      backgroundColor: theme.buttonBackground + '80',
      width: moderateScale(44),
      height: moderateScale(44),
      lineHeight: moderateScale(44),
      textAlign: 'center',
      borderRadius: moderateScale(22),
      overflow: 'hidden',
    },
    detailsContainer: {
      padding: moderateScale(16),
      flex: 1, // Allow content to take remaining space
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
    errorText: {
      fontSize: moderateScale(16),
      color: theme.invalidInput,
      textAlign: 'center',
      margin: moderateScale(20),
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ownerContainer: {
      marginTop: moderateScale(24),
      padding: moderateScale(16),
      backgroundColor: theme.cardBackground,
      borderRadius: moderateScale(8),
      flexDirection: 'row',
      alignItems: 'center',
    },
    ownerImageContainer: {
      width: moderateScale(50),
      height: moderateScale(50),
      borderRadius: moderateScale(25),
      overflow: 'hidden',
      marginRight: moderateScale(12),
      backgroundColor: theme.inputBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ownerImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    placeholderContainer: {
      width: '100%',
      height: '100%',
      borderRadius: moderateScale(25),
      backgroundColor: theme.buttonBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ownerInitials: {
      fontSize: moderateScale(20),
      color: theme.buttonText,
      fontWeight: 'bold',
    },
    ownerInfo: {
      flex: 1,
    },
    ownerName: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: moderateScale(16),
      color: theme.textColor,
      marginBottom: moderateScale(4),
    },
    emailButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.buttonBackground,
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(8),
      borderRadius: moderateScale(4),
    },
    emailIcon: {
      fontSize: moderateScale(16),
      color: theme.buttonText,
      marginRight: moderateScale(4),
    },
    emailButtonText: {
      color: theme.buttonText,
      fontSize: moderateScale(14),
      fontWeight: 'bold',
    },
    ownerEmail: {
      fontSize: moderateScale(14),
      color: theme.textColor,
      marginTop: moderateScale(2),
    },
    mapContainer: {
      marginTop: moderateScale(24),
      marginBottom: moderateScale(24),
      borderRadius: moderateScale(8),
      overflow: 'hidden',
      backgroundColor: theme.cardBackground,
    },
    locationText: {
      padding: moderateScale(16),
      fontSize: moderateScale(16),
      color: theme.textColor,
      fontWeight: 'bold',
    },
    map: {
      width: '100%',
      height: moderateScale(200),
    },
    mapLoader: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -20 }, { translateY: -20 }],
    },
    hiddenMap: {
      display: 'none',
    },
  });
};

export default useProductDetailsScreenStyles;
