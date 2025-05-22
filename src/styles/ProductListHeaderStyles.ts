import { StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
    marginHorizontal: moderateScale(4),
  },
  buttonText: {
    fontSize: moderateScale(16),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: moderateScale(20),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    height: moderateScale(40),
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    minWidth: '45%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: moderateScale(18),
    marginBottom: moderateScale(20),
    fontWeight: 'bold',
  },
  sortButton: {
    width: '100%',
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(10),
    alignItems: 'center',
  },
});

export default styles;
