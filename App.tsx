import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/stacks/AuthStack';
import ProductStack from './src/navigation/stacks/ProductStack';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from './src/store/useAuthStore';
import { useThemeStore } from './src/store/useThemeStore';

const AppNavigator = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? <ProductStack /> : <AuthStack />;
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

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <ThemedApp />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
