import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import useButtonStyles from '../../styles/ButtonStyles';

type ButtonProps = {
  title: string;
  onPress: () => void;
};

const Button = ({ title, onPress }: ButtonProps) => {
  const styles = useButtonStyles();

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
