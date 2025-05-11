import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../navigation/navigator/navigator';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../components/atoms/Button';
import useSignUpScreenStyles from '../styles/SignUpScreenStyles';

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  phone: z
    .string()
    .length(8, 'Phone number must be exactly 8 digits long')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});
type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);
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

  const onSubmit = (data: SignUpFormData) => {
    console.log('Form Data:', data);
    navigation.navigate('Login');
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

        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.errorInput]}
              placeholder="Name"
              placeholderTextColor={styles.input.color}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

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

        <Controller
          name="phone"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.phone && styles.errorInput]}
              placeholder="Phone Number"
              placeholderTextColor={styles.input.color}
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

        <Button title="Sign Up" onPress={handleSubmit(onSubmit)} />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;
