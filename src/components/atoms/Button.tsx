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
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
