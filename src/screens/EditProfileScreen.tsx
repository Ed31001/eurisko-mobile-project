import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { logScreenView } from '../utils/firebase';

// Memoized input to avoid re-rendering
const MemoizedInput = React.memo((props: React.ComponentProps<typeof TextInput>) => <TextInput {...props} />);

type ErrorRetryProps = {
  error: string;
  onRetry: () => void;
  theme: any;
  styles: any;
};

// Memoized error/retry UI
const ErrorRetry = React.memo(({ error, onRetry, theme, styles }: ErrorRetryProps) => (
  <View style={[styles.container, styles.errorCenteredContainer]}>
    <Text style={[styles.errorCenteredText, { color: theme.invalidInput }]}>
      {error}
    </Text>
    <Button title="Retry" onPress={onRetry} />
  </View>
));

type ProfileImageSectionProps = {
  profileImage: any;
  userImageUrl?: string;
  initials: string;
  imageLoading: boolean;
  setImageError: React.Dispatch<React.SetStateAction<boolean>>;
  setImageLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getFullImageUrl: (relativeUrl: string) => string;
  theme: any;
  styles: any;
  onPress: () => void;
};

// Memoized profile image section
const ProfileImageSection = React.memo((props: ProfileImageSectionProps) => {
  const {
    profileImage,
    userImageUrl,
    initials,
    imageLoading,
    setImageError,
    setImageLoading,
    getFullImageUrl,
    theme,
    styles,
    onPress,
  } = props;

  return (
    <TouchableOpacity style={styles.imageContainer} onPress={onPress}>
      {profileImage ? (
        <Image
          source={{ uri: profileImage.uri }}
          style={styles.profileImage}
          onError={(e) => {
            console.error('Failed to load profile image:', e.nativeEvent.error);
            setImageError(true);
          }}
        />
      ) : userImageUrl ? (
        <>
          <Image
            source={{
              uri: getFullImageUrl(userImageUrl),
              headers: { Accept: 'image/*' },
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
          <Text style={styles.placeholderText}>{initials}</Text>
        </View>
      )}
      <View style={styles.editIconContainer}>
        <Text style={styles.editIconText}>✎</Text>
      </View>
    </TouchableOpacity>
  );
});

type ProfileInputsProps = {
  firstName: string;
  lastName: string;
  onFirstNameChange: (text: string) => void;
  onLastNameChange: (text: string) => void;
  styles: any;
};

const ProfileInputs = React.memo(({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  styles,
}: ProfileInputsProps) => (
  <>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>First Name</Text>
      <MemoizedInput
        style={styles.input}
        value={firstName}
        onChangeText={onFirstNameChange}
        placeholder="Enter first name"
        placeholderTextColor={styles.input.color}
      />
    </View>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Last Name</Text>
      <MemoizedInput
        style={styles.input}
        value={lastName}
        onChangeText={onLastNameChange}
        placeholder="Enter last name"
        placeholderTextColor={styles.input.color}
      />
    </View>
  </>
));

const EditProfileScreen = () => {
  // Log screen view on focus
  useFocusEffect(
    useCallback(() => {
      logScreenView('EditProfile', 'EditProfile');
    }, [])
  );

  // Select only what you need from the store
  const user = useAuthStore(s => s.user);
  const updateProfile = useAuthStore(s => s.updateProfile);
  const getUserProfile = useAuthStore(s => s.getUserProfile);
  const { theme } = useThemeStore();
  const styles = useEditProfileScreenStyles();

  // State
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<any>(null);
  const [_imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Memoized initials
  const initials = useMemo(
    () => `${firstName[0] || ''}${lastName[0] || ''}`,
    [firstName, lastName]
  );

  // Memoized handlers for input fields
  const handleFirstNameChange = useCallback((text: string) => setFirstName(text), []);
  const handleLastNameChange = useCallback((text: string) => setLastName(text), []);

  // Memoized getFullImageUrl
  const getFullImageUrl = useCallback((relativeUrl: string) => {
    if (!relativeUrl){ return ''; }
    const cleanPath = relativeUrl.replace(/^\/+/, '').replace(/^api\//, '');
    return `https://backend-practice.eurisko.me/${cleanPath}`;
  }, []);

  // Memoized image picker handler
  const handleImagePick = useCallback(async (type: 'camera' | 'gallery') => {
    const options: CameraOptions & ImageLibraryOptions = {
      mediaType: 'photo' as const,
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
    };

    try {
      const result: ImagePickerResponse =
        type === 'camera'
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

  // Memoized image picker options
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

  // Memoized submit handler
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

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileError(null);
      try {
        await getUserProfile();
      } catch (err: any) {
        setProfileError('Failed to load profile. Please try again.');
      }
    };
    fetchProfile();
  }, [getUserProfile]);

  // Retry handler
  const handleRetryProfile = useCallback(async () => {
    setProfileError(null);
    try {
      await getUserProfile();
    } catch (err: any) {
      setProfileError('Failed to load profile. Please try again.');
    }
  }, [getUserProfile]);

  // Update fields when user changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  // Show error/retry UI if profile failed to load and no user data
  if (profileError && (!user || (!user.firstName && !user.lastName))) {
    return (
      <ErrorRetry
        error={profileError}
        onRetry={handleRetryProfile}
        theme={theme}
        styles={styles}
      />
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <ProfileImageSection
          profileImage={profileImage}
          userImageUrl={user?.profileImage?.url}
          initials={initials}
          imageLoading={imageLoading}
          setImageError={setImageError}
          setImageLoading={setImageLoading}
          getFullImageUrl={getFullImageUrl}
          theme={theme}
          styles={styles}
          onPress={showImagePickerOptions}
        />

        <ProfileInputs
          firstName={firstName}
          lastName={lastName}
          onFirstNameChange={handleFirstNameChange}
          onLastNameChange={handleLastNameChange}
          styles={styles}
        />
        <Button
          title={loading ? 'Updating...' : 'Save Changes'}
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;
