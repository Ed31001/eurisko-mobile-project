import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/stacks/AuthStack';
import TabNavigator from './src/navigation/TabNavigator';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from './src/store/useAuthStore';
import { useThemeStore } from './src/store/useThemeStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const AppNavigator = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? <TabNavigator /> : <AuthStack />;
};

const ThemedApp = () => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      edges={['left', 'right', 'bottom']} // Exclude top padding
    >
      <AppNavigator />
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={styles.rootView}>
      <NavigationContainer>
        <ThemedApp />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rootView: {
    flex: 1,
  },
});

export default App;
