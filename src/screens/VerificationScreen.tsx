import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../navigation/navigator/navigator';
import { useAuth } from '../context/AuthContext';
import Button from '../components/atoms/Button';

const VerificationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth(); // Access the login function from AuthContext
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    if (otp === '1234') {
      login(); // Save the login state after successful verification
      navigation.navigate('ProductList');
    } else {
      Alert.alert('Invalid Code', 'Please enter the correct 4-digit code.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter 4-digit code</Text>
        <TextInput
          style={styles.input}
          placeholder="_ _ _ _"
          keyboardType="number-pad"
          maxLength={4}
          value={otp}
          onChangeText={setOtp}
        />
        <Button title="Verify" onPress={handleVerify} />
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
});

export default VerificationScreen;
