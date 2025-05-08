import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import NavBar from '../components/organisms/NavBar';

const VerificationScreen = () => {
  return (
    <View style={styles.container}>
      <NavBar title="Verify Your Account" />
      <View style={styles.content}>
        <Text style={styles.title}>Enter 4-digit code</Text>
        <TextInput
          style={styles.input}
          placeholder="_ _ _ _"
          keyboardType="number-pad"
          maxLength={4}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 8,
  },
  button: {
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerificationScreen;
