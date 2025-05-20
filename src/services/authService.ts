import api from '../api/axios';

export type SignUpData = FormData;

export type LoginResponse = {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export const authService = {
  signUp: async (data: SignUpData) => {
    try {
      console.log('SignUp Request:', {
        url: '/auth/signup',
        data,
      });

      const response = await api.post('/auth/signup', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('SignUp Response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.log('SignUp Error:', JSON.stringify(error.response?.data, null, 2));
      throw error;
    }
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

  getUserProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<SignUpData>) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof SignUpData]);
    });

    const response = await api.put('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
