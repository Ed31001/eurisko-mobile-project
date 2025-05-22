import axios from 'axios';
import { API_URL } from '@env';
import { useAuthStore } from '../store/useAuthStore';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
  timeout: 10000, // 10 second timeout
});

// Add retry logic
api.interceptors.response.use(undefined, async (error) => {
  const { config, response } = error;

  if (!config || !config.retry) {
    return Promise.reject(error);
  }

  config.retry -= 1;

  if (response?.status === 521) {
    // Wait 2 seconds before retrying
    await new Promise(resolve => setTimeout(resolve, 2000));
    return api(config);
  }

  return Promise.reject(error);
});

// Add retry configuration to all requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add retry configuration
    config.retry = 3; // Number of retries
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
