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
      console.log('Verify OTP Request:', {
        url: '/auth/verify-otp',
        data: { email, otp },
      });

      const response = await api.post('/auth/verify-otp', { email, otp });
      console.log('Verify OTP Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.log('Verify OTP Error:', JSON.stringify(error.response?.data, null, 2));
      throw error;
    }
  },

  resendOtp: async (email: string) => {
    const response = await api.post('/auth/resend-verification-otp', { email });
    return response.data;
  },

  login: async (email: string, password: string, token_expires_in = '1y') => {
    try {
      console.log('Login Request:', {
        url: '/auth/login',
        data: { email, password, token_expires_in },
      });

      const response = await api.post('/auth/login', {
        email,
        password,
        token_expires_in,
      });
      console.log('Login Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.log('Login Error:', JSON.stringify(error.response?.data, null, 2));
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
      console.log('Updating profile with form data');

      const response = await api.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        transformRequest: (data) => data,
      });

      console.log('Profile update response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update profile');
      }

      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      console.log('Get profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
};
