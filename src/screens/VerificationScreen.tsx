import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Button from '../components/atoms/Button';
import styles from '../styles/VerificationScreenStyles';

const VerificationScreen = () => {
  const { login } = useAuth();
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    if (otp === '1234') {
      login(); // Save the login state
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

export default VerificationScreen;
