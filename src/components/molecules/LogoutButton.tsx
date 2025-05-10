import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../navigation/navigator/navigator';
import { useAuth } from '../../context/AuthContext';

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

export default HeaderRightLogoutButton;
