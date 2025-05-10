import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, StyleSheet, View, Modal, Button } from 'react-native';
import SignUpScreen from '../../screens/SignUpScreen';
import LoginScreen from '../../screens/LoginScreen';
import VerificationScreen from '../../screens/VerificationScreen';
import ProductListScreen from '../../screens/ProductListScreen';
import ProductDetailsScreen from '../../screens/ProductDetailsScreen';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../navigator/navigator';
import { useAuth } from '../../context/AuthContext';

const Stack = createNativeStackNavigator();

// Move HeaderRightLogoutButton outside of AppStack
const HeaderRightLogoutButton = () => {
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    logout(); // Log the user out
    navigation.navigate('Login'); // Navigate to the Login screen
    setModalVisible(false); // Close the modal
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.headerButton}>
        <Text style={styles.headerButtonText}>Logout</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="gray" />
              <Button title="Logout" onPress={handleLogout} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignUp"
      screenOptions={{
        headerStyle: { backgroundColor: 'blue' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        headerTitleAlign: 'center',
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
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: 'Products',
          headerBackVisible: false,
          headerRight: HeaderRightLogoutButton, // Pass the component reference
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          title: 'Product Details',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 10,
    padding: 8,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default AppStack;
