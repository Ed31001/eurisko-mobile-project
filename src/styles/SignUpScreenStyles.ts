import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
  },
  showPasswordButton: {
    paddingHorizontal: 12,
  },
  showPasswordText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 16,
    fontSize: 14,
    color: 'blue',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
  },
  errorInput: {
    borderColor: 'red',
  },
});

export default styles;
