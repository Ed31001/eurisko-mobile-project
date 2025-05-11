import { StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';

const styles = StyleSheet.create({
  headerButton: {
    marginRight: moderateScale(10),
    padding: moderateScale(8),
    backgroundColor: 'red',
    borderRadius: moderateScale(5),
  },
  headerButtonText: {
    fontFamily: 'OpenSans-Regular',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: moderateScale(300),
    padding: moderateScale(20),
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  modalText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: moderateScale(16),
    marginBottom: moderateScale(20),
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default styles;
