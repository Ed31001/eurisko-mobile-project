import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthStack from './src/navigation/stacks/AuthStack';
import ProductStack from './src/navigation/stacks/ProductStack';

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <ProductStack /> : <AuthStack />;
};

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
