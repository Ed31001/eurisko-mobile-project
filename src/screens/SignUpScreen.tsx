import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../navigation/navigator/navigator';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { launchCamera, launchImageLibrary, CameraOptions, ImageLibraryOptions, MediaType } from 'react-native-image-picker';
import Button from '../components/atoms/Button';
import useSignUpScreenStyles from '../styles/SignUpScreenStyles';
import { useAuthStore } from '../store/useAuthStore';

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpScreen = () => {
  const { signUp, setEmail, error, loading } = useAuthStore();
  const navigation = useNavigation<NavigationProp>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);
  const [profileImage, setProfileImage] = useState<any>(null);
  const styles = useSignUpScreenStyles();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    const onChange = ({ window }: { window: { width: number; height: number } }) => {
      setIsPortrait(window.height >= window.width);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    onChange({ window: Dimensions.get('window') });
    return () => {
      subscription?.remove();
    };
  }, []);

  const handleImagePick = async (type: 'camera' | 'gallery') => {
    try {
      const options: CameraOptions & ImageLibraryOptions = {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
        saveToPhotos: true,
      };

      if (type === 'camera') {
        const result = await launchCamera(options);
        if (result.assets && result.assets[0]) {
          setProfileImage({
            uri: result.assets[0].uri,
            type: result.assets[0].type || 'image/jpeg',
            name: result.assets[0].fileName || 'photo.jpg',
          });
        }
      } else {
        const result = await launchImageLibrary(options);
        if (result.assets && result.assets[0]) {
          setProfileImage({
            uri: result.assets[0].uri,
            type: result.assets[0].type || 'image/jpeg',
            name: result.assets[0].fileName || 'photo.jpg',
          });
        }
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const showImagePickerOptions = () => {
      Alert.alert(
        'Profile Picture',
        'Choose an option',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Take Photo',
            onPress: () => handleImagePick('camera'),
          },
          {
            text: 'Choose from Library',
            onPress: () => handleImagePick('gallery'),
          },
        ],
        { cancelable: true }
      );
  };

  const onSubmit = async (data: SignUpFormData) => {
    const success = await signUp({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    if (success) {
      setEmail(data.email);
      Alert.alert(
        'Success',
        'Please check your email for the verification code.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Verification'),
          },
        ]
      );
    } else {
      Alert.alert('Error', error || 'Sign up failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          styles.scrollViewContent,
          isPortrait ? styles.scrollViewContentPortrait : styles.scrollViewContentLandscape,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Sign Up</Text>

        <TouchableOpacity
          style={styles.imagePickerContainer}
          onPress={showImagePickerOptions}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage.uri }}
              style={styles.profileImage}
            />
          ) : (
            <>
              <Text style={styles.imagePickerText}>Add Profile Picture</Text>
              <Text style={styles.imagePickerSubText}>(Optional)</Text>
            </>
          )}
        </TouchableOpacity>

        <Controller
          name="firstName"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.firstName && styles.errorInput]}
              placeholder="First Name"
              placeholderTextColor={styles.input.color}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

        <Controller
          name="lastName"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.lastName && styles.errorInput]}
              placeholder="Last Name"
              placeholderTextColor={styles.input.color}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.email && styles.errorInput]}
              placeholder="Email"
              placeholderTextColor={styles.input.color}
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <View style={[styles.passwordContainer, errors.password && styles.errorInput]}>
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor={styles.passwordInput.color}
                secureTextEntry={!passwordVisible}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.showPasswordButton}
          >
            <Text style={styles.showPasswordText}>
              {passwordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <Button
          title={loading ? 'Signing up...' : 'Sign Up'}
          onPress={handleSubmit(onSubmit)}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;
