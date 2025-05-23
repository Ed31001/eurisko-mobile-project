import { api } from '../api/axios';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileImage?: {
    uri: string;
    type?: string;
    name?: string;
  };
}

export interface SignUpResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export type LoginResponse = {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: {
    url: string;
  } | null;
  isEmailVerified: boolean;
  createdAt: string;
}

export const authService = {
  signUp: async (formData: FormData): Promise<SignUpResponse> => {
    const response = await api.post('/auth/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  resendOtp: async (email: string) => {
    const response = await api.post('/auth/resend-verification-otp', { email });
    return response.data;
  },

  login: async (email: string, password: string, token_expires_in = '1y') => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        token_expires_in,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  refreshToken: async (refreshToken: string, token_expires_in = '1y') => {
    const response = await api.post('/auth/refresh-token', {
      refreshToken,
      token_expires_in,
    });
    return response.data;
  },

  updateProfile: async (formData: FormData) => {
    try {
      const response = await api.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        transformRequest: (data) => data,
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update profile');
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
