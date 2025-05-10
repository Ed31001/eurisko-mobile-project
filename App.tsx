import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import AppStack from './src/navigation/stacks/AppStack';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
