import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle; // Allow additional styles to be passed
};

const Button = ({ title, onPress, color = 'blue', style }: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color }, style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
