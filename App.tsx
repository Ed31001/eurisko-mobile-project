import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AuthStack from './src/navigation/stacks/AuthStack';
import ProductStack from './src/navigation/stacks/ProductStack';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <ProductStack /> : <AuthStack />;
};

const ThemedApp = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <AppNavigator />
    </SafeAreaView>
  );
};

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <ThemedApp />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
