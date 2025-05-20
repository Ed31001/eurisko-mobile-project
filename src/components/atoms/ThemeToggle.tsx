import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';

const ThemeToggle = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

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
