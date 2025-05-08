import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type NavBarProps = {
  title: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const NavBar = ({ title, onLeftPress, onRightPress, leftIcon, rightIcon }: NavBarProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onLeftPress} style={styles.iconContainer}>
        {leftIcon}
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onRightPress} style={styles.iconContainer}>
        {rightIcon}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 86,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'blue',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingTop: 36,
  },
  iconContainer: {
    padding: 8,
  },
});

export default NavBar;
