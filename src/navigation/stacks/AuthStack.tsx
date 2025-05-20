import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from '../../screens/SignUpScreen';
import LoginScreen from '../../screens/LoginScreen';
import VerificationScreen from '../../screens/VerificationScreen';
import ThemeToggle from '../../components/atoms/ThemeToggle';
import { useThemeStore } from '../../store/useThemeStore';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const theme = useThemeStore((state) => state.theme);

  const renderThemeToggle = () => <ThemeToggle />;

  return (
    <Stack.Navigator
      initialRouteName="SignUp"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTintColor: theme.buttonText,
        headerTitleStyle: {
          fontFamily: 'Roboto-Bold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
        headerRight: renderThemeToggle,
      }}
    >
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          title: 'Welcome',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Welcome Back',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Verification"
        component={VerificationScreen}
        options={{
          title: 'Verify your Account',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
