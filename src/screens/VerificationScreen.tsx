import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../navigation/navigator/navigator';
import Button from '../components/atoms/Button';
import useVerificationScreenStyles from '../styles/VerificationScreenStyles';
import { useAuthStore } from '../store/useAuthStore';
import { useFocusEffect } from '@react-navigation/native';
import { logScreenView } from '../utils/firebase';

const VerificationScreen = () => {
  const styles = useVerificationScreenStyles();
  const navigation = useNavigation<NavigationProp>();
  const { verifyOtp, resendOtp, error, loading } = useAuthStore();
  const [otp, setOtp] = useState('');

  const handleVerify = useCallback(async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code.');
      return;
    }
    const success = await verifyOtp(otp);
    if (success) {
      Alert.alert('Success', 'Email verified successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } else {
      Alert.alert('Invalid Code', error || 'Please enter the correct code.');
    }
  }, [otp, verifyOtp, error, navigation]);

  const handleResendOtp = useCallback(async () => {
    const success = await resendOtp();
    if (success) {
      Alert.alert('Success', 'Verification code resent successfully');
    } else {
      Alert.alert('Error', error || 'Failed to resend verification code');
    }
  }, [resendOtp, error]);

  useFocusEffect(
    React.useCallback(() => {
      logScreenView('VerificationScreen', 'VerificationScreen');
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter 6-digit code</Text>
        <TextInput
          style={styles.input}
          placeholder="_ _ _ _ _ _"
          placeholderTextColor={styles.input.color}
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />
        <Button
          title={loading ? 'Verifying...' : 'Verify'}
          onPress={handleVerify}
        />
        <Button
          title={loading ? 'Sending...' : 'Resend Code'}
          onPress={handleResendOtp}
        />
      </View>
    </View>
  );
};

export default VerificationScreen;
