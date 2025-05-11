import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Modal, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/LogoutButtonStyles';

const HeaderLeftLogoutButton = () => {
  const { logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    logout();
    setModalVisible(false);
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

export default HeaderLeftLogoutButton;
