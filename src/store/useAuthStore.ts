import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: {
    url: string;
  } | null;
  isEmailVerified: boolean;
  createdAt: string;
};

type SignUpData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileImage?: {
    uri: string;
    type?: string;
    name?: string;
  };
};

type AuthState = {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  signUp: (data: SignUpData) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  resendOtp: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  setEmail: (email: string) => void;
  refreshAccessToken: () => Promise<boolean>;
  getUserProfile: () => Promise<boolean>;
  updateProfile: (data: FormData) => Promise<boolean>;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      isLoggedIn: false,
      loading: false,
      error: null,
      email: null,
      accessToken: null,
      refreshToken: null,
      user: null,

      setEmail: (email) => set({ email }),

      signUp: async ({ email, password, firstName, lastName, profileImage }) => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('email', email);
          formData.append('password', password);
          formData.append('firstName', firstName);
          formData.append('lastName', lastName);

          if (profileImage) {
            formData.append('profileImage', {
              uri: profileImage.uri,
              type: profileImage.type || 'image/jpeg',
              name: profileImage.name || 'photo.jpg',
            } as any);
          }

          const response = await authService.signUp(formData);
          if (response.success) {
            set({ email });
            return true;
          }
          throw new Error('Sign up failed');
        } catch (err: any) {
          set({ error: err.response?.data?.error?.message || 'Sign up failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      verifyOtp: async (otp) => {
        set({ loading: true, error: null });
        try {
          const email = get().email;
          if (!email){ throw new Error('No email set'); }
          await authService.verifyOtp(email, otp);
          set({ isLoggedIn: false });
          return true;
        } catch (err: any) {
          set({ error: err.response?.data?.error?.message || 'OTP verification failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      resendOtp: async () => {
        set({ loading: true, error: null });
        try {
          const email = get().email;
          if (!email){ throw new Error('No email set'); }
          await authService.resendOtp(email);
          return true;
        } catch (err: any) {
          set({ error: err.response?.data?.error?.message || 'Resend OTP failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login(email, password);
          const { accessToken, refreshToken } = response.data;
          set({
            isLoggedIn: true,
            accessToken,
            refreshToken,
            email,
          });
          await get().getUserProfile();
          return true;
        } catch (err: any) {
          set({ error: err.response?.data?.error?.message || 'Login failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        set({
          isLoggedIn: false,
          accessToken: null,
          refreshToken: null,
          email: null,
          user: null,
        });
      },

      forgotPassword: async (email) => {
        set({ loading: true, error: null });
        try {
          await authService.forgotPassword(email);
          return true;
        } catch (err: any) {
          set({ error: err.response?.data?.error?.message || 'Forgot password failed' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      refreshAccessToken: async () => {
        try {
          const refreshToken = get().refreshToken;
          if (!refreshToken){ return false; }

          const response = await authService.refreshToken(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          set({ accessToken, refreshToken: newRefreshToken });
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },

      getUserProfile: async () => {
        try {
          const response = await authService.getUserProfile();
          if (response.success) {
            set({ user: response.data.user });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Get profile error:', error);
          return false;
        }
      },

      updateProfile: async (formData: FormData) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.updateProfile(formData);
          if (response.success) {
            set({ user: response.data.user });
            return true;
          }
          throw new Error('Failed to update profile');
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || error.message;
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
