import axios from 'axios';
import { API_URL } from '@env';
import { useAuthStore } from '../store/useAuthStore';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    retry?: number;
  }
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
  timeout: 10000,
});

api.interceptors.response.use(undefined, async (error) => {
  const { config, response } = error;

  // --- Automatic token refresh on 401 ---
  if (response?.status === 401 && !config._retry) {
    config._retry = true;
    const refreshed = await useAuthStore.getState().refreshAccessToken?.();
    if (refreshed) {
      // Update the Authorization header with the new token
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return api(config);
    } else {
      // Optionally, trigger logout here if needed
      useAuthStore.getState().logout?.();
      return Promise.reject(error);
    }
  }

  // --- Existing retry logic for 521 ---
  if (!config || !config.retry) {
    return Promise.reject(error);
  }

  config.retry -= 1;

  if (response?.status === 521) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return api(config);
  }

  return Promise.reject(error);
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.retry = 3;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
