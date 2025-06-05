import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { launchCamera, launchImageLibrary, ImagePickerResponse, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
import Button from '../components/atoms/Button';
import useEditProfileScreenStyles from '../styles/EditProfileScreenStyles';
import { useThemeStore } from '../store/useThemeStore';

const EditProfileScreen = () => {
  const { user, updateProfile, getUserProfile } = useAuthStore();
  const { theme } = useThemeStore();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<any>(null);
  const [_imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const styles = useEditProfileScreenStyles();

  const getFullImageUrl = useCallback((relativeUrl: string) => {
    if (!relativeUrl){ return ''; }
    const cleanPath = relativeUrl
      .replace(/^\/+/, '')
      .replace(/^api\//, '');
    return `https://backend-practice.eurisko.me/${cleanPath}`;
  }, []);

  const handleImagePick = useCallback(async (type: 'camera' | 'gallery') => {
    const options: CameraOptions & ImageLibraryOptions = {
      mediaType: 'photo' as const,
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
    };

    try {
      const result: ImagePickerResponse = type === 'camera'
        ? await launchCamera(options)
        : await launchImageLibrary(options);

      if (result.assets && result.assets[0]) {
        setProfileImage({
          uri: result.assets[0].uri,
          type: result.assets[0].type || 'image/jpeg',
          name: result.assets[0].fileName || 'photo.jpg',
        });
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  }, []);

  const showImagePickerOptions = useCallback(() => {
    Alert.alert(
      'Update Profile Picture',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => handleImagePick('camera') },
        { text: 'Choose from Library', onPress: () => handleImagePick('gallery') },
      ],
      { cancelable: true }
    );
  }, [handleImagePick]);

  const handleSubmit = useCallback(async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('firstName', firstName.trim());
      formData.append('lastName', lastName.trim());

      if (profileImage) {
        const imageFile = {
          uri: profileImage.uri,
          type: profileImage.type || 'image/jpeg',
          name: profileImage.name || 'profile.jpg',
        };

        formData.append('profileImage', imageFile as any);
      }

      const success = await updateProfile(formData);
      if (success) {
        await getUserProfile();
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, profileImage, updateProfile, getUserProfile]);

  const initials = useMemo(
    () => `${firstName[0] || ''}${lastName[0] || ''}`,
    [firstName, lastName]
  );

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={showImagePickerOptions}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage.uri }}
              style={styles.profileImage}
              onError={(e) => {
                console.error('Failed to load profile image:', e.nativeEvent.error);
                setImageError(true);
              }}
            />
          ) : user?.profileImage?.url ? (
            <>
              <Image
                source={{
                  uri: getFullImageUrl(user.profileImage.url),
                  headers: {
                    Accept: 'image/*',
                  },
                }}
                style={styles.profileImage}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={(e) => {
                  console.error('Failed to load profile image:', e.nativeEvent.error);
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
              {imageLoading && (
                <ActivityIndicator
                  size="large"
                  color={theme.buttonBackground}
                  style={styles.loader}
                />
              )}
            </>
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                {initials}
              </Text>
            </View>
          )}
          <View style={styles.editIconContainer}>
            <Text style={styles.editIconText}>✎</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
            placeholderTextColor={styles.input.color}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
            placeholderTextColor={styles.input.color}
          />
        </View>

        <Button
          title={loading ? 'Updating...' : 'Save Changes'}
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;
