import { StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';
import { useThemeStore } from '../store/useThemeStore';

const useTabNavigatorStyles = () => {
  const theme = useThemeStore((state) => state.theme);

  return StyleSheet.create({
    tabIcon: {
      fontSize: moderateScale(24),
    },
    tabBar: {
      backgroundColor: theme.cardBackground,
      borderTopColor: theme.borderColor,
    },
    headerStyle: {
      backgroundColor: theme.headerBackground,
    },
    headerTitleStyle: {
      fontFamily: 'Roboto-Bold',
      fontSize: 18,
    },
    headerLeft: {
      marginLeft: moderateScale(16),
    },
    headerRight: {
      marginRight: moderateScale(16),
    },
  });
};

export default useTabNavigatorStyles;
