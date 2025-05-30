import { StyleSheet } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { moderateScale } from '../utils/responsive';

const useCartScreenStyles = () => {
  const theme = useThemeStore((state) => state.theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    listContent: {
      padding: moderateScale(16),
    },
    cartItem: {
      flexDirection: 'row',
      backgroundColor: theme.cardBackground,
      borderRadius: moderateScale(8),
      marginBottom: moderateScale(16),
      padding: moderateScale(12),
      elevation: 2,
    },
    itemImage: {
      width: moderateScale(80),
      height: moderateScale(80),
      borderRadius: moderateScale(8),
    },
    itemDetails: {
      flex: 1,
      marginLeft: moderateScale(12),
    },
    itemTitle: {
      fontSize: moderateScale(16),
      color: theme.textColor,
      marginBottom: moderateScale(4),
    },
    itemPrice: {
      fontSize: moderateScale(14),
      color: theme.textColor,
      fontWeight: 'bold',
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: moderateScale(8),
    },
    quantityButton: {
      backgroundColor: theme.buttonBackground,
      width: moderateScale(30),
      height: moderateScale(30),
      borderRadius: moderateScale(15),
      justifyContent: 'center',
      alignItems: 'center',
    },
    quantityButtonText: {
      color: theme.buttonText,
      fontSize: moderateScale(18),
    },
    quantity: {
      marginHorizontal: moderateScale(12),
      fontSize: moderateScale(16),
      color: theme.textColor,
    },
    deleteButton: {
      backgroundColor: theme.invalidInput,
      justifyContent: 'center',
      alignItems: 'center',
      width: moderateScale(80),
      height: '100%',
    },
    deleteButtonText: {
      color: theme.buttonText,
      fontWeight: 'bold',
    },
    footer: {
      padding: moderateScale(16),
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
    },
    total: {
      fontSize: moderateScale(18),
      fontWeight: 'bold',
      color: theme.textColor,
      marginBottom: moderateScale(16),
    },
    checkoutButton: {
      backgroundColor: theme.buttonBackground,
      padding: moderateScale(16),
      borderRadius: moderateScale(8),
      alignItems: 'center',
    },
    checkoutButtonText: {
      color: theme.buttonText,
      fontSize: moderateScale(16),
      fontWeight: 'bold',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: moderateScale(16),
      color: theme.textColor,
    },
  });
};

export default useCartScreenStyles;
