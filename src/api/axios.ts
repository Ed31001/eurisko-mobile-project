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
