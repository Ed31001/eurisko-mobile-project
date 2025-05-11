import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from '../../screens/SignUpScreen';
import LoginScreen from '../../screens/LoginScreen';
import VerificationScreen from '../../screens/VerificationScreen';
import ThemeToggle from '../../components/atoms/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { moderateScale } from '../../utils/responsive';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const { theme } = useTheme();

  const renderThemeToggle = () => <ThemeToggle />;

  return (
    <Stack.Navigator
      initialRouteName="SignUp"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerBackground,
          height: moderateScale(40),
        },
        headerTintColor: theme.buttonText,
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18, lineHeight: 22 },
        headerTitleAlign: 'center',
        headerTitleContainerStyle: { marginVertical: 0, paddingVertical: 0 },
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
