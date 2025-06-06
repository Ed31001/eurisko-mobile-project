import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../navigation/navigator/navigator';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../components/atoms/Button';
import useLoginScreenStyles from '../styles/LoginScreenStyles';
import { useAuthStore } from '../store/useAuthStore';
import { useFocusEffect } from '@react-navigation/native';
import { logScreenView } from '../utils/firebase';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const ShowHideButton = React.memo(function ShowHideButton({ visible, setVisible, styles }: { visible: boolean; setVisible: (v: boolean) => void; styles: any }) {
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

  const showHideButton = React.useMemo(
    () => <ShowHideButton visible={visible} setVisible={setVisible} styles={styles} />,
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

const LoginScreen = () => {
  const { login, error, loading } = useAuthStore();
  const navigation = useNavigation<NavigationProp>();
  const [isPortrait, setIsPortrait] = useState(true);
  const styles = useLoginScreenStyles();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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

  const onSubmit = useCallback(async (data: LoginFormData) => {
    const success = await login(data.email, data.password);
    if (!success) {
      Alert.alert('Login Failed', error || 'Please check your credentials and try again.');
    }
  }, [login, error]);

  const handleNavigateToSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      logScreenView('LoginScreen', 'LoginScreen');
    }, [])
  );

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
        <Text style={styles.title}>Login</Text>

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
          title={loading ? 'Logging in...' : 'Login'}
          onPress={handleSubmit(onSubmit)}
        />
        <TouchableOpacity onPress={handleNavigateToSignUp}>
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
