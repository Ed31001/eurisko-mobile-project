import React from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import AuthStack from './src/navigation/stacks/AuthStack';
import TabNavigator from './src/navigation/TabNavigator';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from './src/store/useAuthStore';
import { useThemeStore } from './src/store/useThemeStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Linking } from 'react-native';

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
      <NavigationContainer
        linking={linking}
        ref={navigationRef}
        onReady={() => {
          (global as any).navigationReady = true;
          if ((global as any).pendingOpenUrl) {
            Linking.openURL((global as any).pendingOpenUrl);
            (global as any).pendingOpenUrl = null;
          }
        }}
      >
        <ThemedApp />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const linking = {
  prefixes: ['myproject://'],
  config: {
    screens: {
      Products: {
        path: 'products',
        screens: {
          ProductList: '', // default route for /products
          ProductDetails: ':id', // /products/:id
          AddProduct: 'add',
          EditProduct: 'edit',
          Cart: 'cart',
        },
      },
      Profile: 'profile',
    },
  },
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

export const navigationRef = React.createRef<NavigationContainerRef<any>>();
