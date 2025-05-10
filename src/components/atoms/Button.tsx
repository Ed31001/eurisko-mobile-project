import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import styles from '../../styles/ButtonStyles'; // Adjust the path as necessary

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

export default Button;
