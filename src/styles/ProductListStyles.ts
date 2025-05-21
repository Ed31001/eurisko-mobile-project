import { StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
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
    backgroundColor: 'blue',
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(5),
  },
  paginationButtonDisabled: {
    backgroundColor: 'gray',
    opacity: 0.5,
  },
  paginationButtonText: {
    color: 'white',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  paginationButtonTextDisabled: {
    color: '#ccc',
  },
  paginationText: {
    fontSize: moderateScale(14),
  },
});

export default styles;
