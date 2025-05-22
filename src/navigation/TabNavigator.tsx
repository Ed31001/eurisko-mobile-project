import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductStack from './stacks/ProductStack';
import EditProfileScreen from '../screens/EditProfileScreen';
import { useThemeStore } from '../store/useThemeStore';
import useTabNavigatorStyles from '../styles/TabNavigatorStyles';
import LogoutButton from '../components/molecules/LogoutButton';
import ThemeToggle from '../components/atoms/ThemeToggle';

const Tab = createBottomTabNavigator();

const ProductsTabIcon = ({ color }: { color: string }) => {
  const styles = useTabNavigatorStyles();
  return <Text style={[styles.tabIcon, { color }]}>🛍️</Text>;
};

const ProfileTabIcon = ({ color }: { color: string }) => {
  const styles = useTabNavigatorStyles();
  return <Text style={[styles.tabIcon, { color }]}>👤</Text>;
};

const HeaderRight = () => {
  const styles = useTabNavigatorStyles();
  return (
    <View style={styles.headerRight}>
      <ThemeToggle />
    </View>
  );
};

const HeaderLeft = () => {
  const styles = useTabNavigatorStyles();
  return (
    <View style={styles.headerLeft}>
      <LogoutButton />
    </View>
  );
};

const TabNavigator = () => {
  const theme = useThemeStore((state) => state.theme);
  const styles = useTabNavigatorStyles();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.buttonBackground,
        tabBarInactiveTintColor: theme.textColor,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerTintColor: theme.buttonText,
        headerTitleAlign: 'center',
      }}
    >
      <Tab.Screen
        name="Products"
        component={ProductStack}
        options={{
          headerShown: false,
          tabBarIcon: ProductsTabIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          headerShown: true,
          tabBarIcon: ProfileTabIcon,
          headerLeft: HeaderLeft,
          headerRight: HeaderRight,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
