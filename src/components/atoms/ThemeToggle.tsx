import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme}>
      <Text style={styles.icon}>{isDarkMode ? '🌙' : '☀️'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
});

export default ThemeToggle;
