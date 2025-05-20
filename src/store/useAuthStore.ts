import { create } from 'zustand';
import { authService } from '../services/authService';

type AuthState = {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  signUp: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  resendOtp: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  setEmail: (email: string) => void;
  refreshAccessToken: () => Promise<boolean>;
  getUserProfile: () => Promise<boolean>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  loading: false,
  error: null,
  email: null,
  accessToken: null,
  refreshToken: null,
  user: null,

  setEmail: (email) => set({ email }),

  signUp: async ({ email, password, firstName, lastName }) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      await authService.signUp(formData);
      set({ email }); // Store email for verification
      return true;
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
      set({ isLoggedIn: false }); // Don't log in after verification
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

  logout: () => set({
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    email: null,
    user: null,
  }),

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
      set({ user: response.data.user });
      return true;
    } catch (error) {
      return false;
    }
  },
}));
