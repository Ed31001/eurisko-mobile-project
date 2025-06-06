import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { logScreenView } from '../utils/firebase';

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

interface SignUpFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileImage?: {
    uri: string;
    type: string;
    name: string;
  };
}

const ShowHideButton = React.memo(function ShowHideButton({
  visible,
  setVisible,
  styles,
}: {
  visible: boolean;
  setVisible: (v: boolean) => void;
  styles: any;
}) {
  return (
    <TouchableOpacity
      onPress={() => setVisible(!visible)}
      style={styles.showPasswordButton}
    >
      <Text style={styles.showPasswordText}>
        {visible ? 'Hide' : 'Show'}
      </Text>
    </TouchableOpacity>
  );
});

const PasswordField = React.memo(function PasswordField({
  value,
  onChange,
  error,
  styles,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  styles: any;
  placeholder: string;
}) {
  const [visible, setVisible] = React.useState(false);

  // Memoize the show/hide button so it only re-renders when 'visible' changes
  const showHideButton = React.useMemo(
    () => (
      <ShowHideButton
        visible={visible}
        setVisible={setVisible}
        styles={styles}
      />
    ),
    [visible, setVisible, styles]
  );

  return (
    <View style={[styles.passwordContainer, error && styles.errorInput]}>
      <TextInput
        style={styles.passwordInput}
        placeholder={placeholder}
        placeholderTextColor={styles.passwordInput.color}
        secureTextEntry={!visible}
        value={value}
        onChangeText={onChange}
      />
      {showHideButton}
    </View>
  );
});

const SignUpScreen = () => {
  const { signUp, setEmail, error, loading } = useAuthStore();
  const navigation = useNavigation<NavigationProp>();
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

  const handleImagePick = useCallback(
    async (type: 'camera' | 'gallery') => {
      try {
        const options: CameraOptions & ImageLibraryOptions = {
          mediaType: 'photo' as MediaType,
          quality: 0.8,
          maxWidth: 500,
          maxHeight: 500,
          saveToPhotos: true,
        };

        let result;
        if (type === 'camera') {
          result = await launchCamera(options);
        } else {
          result = await launchImageLibrary(options);
        }
        if (result.assets && result.assets[0]) {
          setProfileImage({
            uri: result.assets[0].uri,
            type: result.assets[0].type || 'image/jpeg',
            name: result.assets[0].fileName || 'photo.jpg',
          });
        }
      } catch (err) {
        console.error('Error picking image:', err);
        Alert.alert('Error', 'Failed to pick image. Please try again.');
      }
    },
    []
  );

  const showImagePickerOptions = useCallback(() => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => handleImagePick('camera') },
        { text: 'Choose from Library', onPress: () => handleImagePick('gallery') },
      ],
      { cancelable: true }
    );
  }, [handleImagePick]);

  const onSubmit = useCallback(
    async (data: SignUpFormData) => {
      const success = await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: profileImage || undefined,
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
    },
    [signUp, setEmail, profileImage, error, navigation]
  );

  const handleNavigateToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  // Memoize scrollViewContentStyle for performance
  const scrollViewContentStyle = useMemo(
    () => [
      styles.content,
      styles.scrollViewContent,
      isPortrait ? styles.scrollViewContentPortrait : styles.scrollViewContentLandscape,
    ],
    [styles, isPortrait]
  );

  useFocusEffect(
    React.useCallback(() => {
      logScreenView('SignUpScreen', 'SignUpScreen');
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={scrollViewContentStyle}
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

        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value } }) => (
            <PasswordField
              value={value}
              onChange={onChange}
              error={errors.password?.message}
              styles={styles}
              placeholder="Password"
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <Button
          title={loading ? 'Signing up...' : 'Sign Up'}
          onPress={handleSubmit(onSubmit)}
        />
        <TouchableOpacity onPress={handleNavigateToLogin}>
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;
