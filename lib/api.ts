import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      Cookies.remove('auth_token', { path: '/' });
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const isPublic =
          path.startsWith('/login') ||
          path.startsWith('/register') ||
          path === '/' ||
          path.startsWith('/user/products') ||
          path.startsWith('/user/cart') ||
          path.startsWith('/user/checkout') ||
          path.startsWith('/user/order-placed');
        if (!isPublic) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export async function makeRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: Record<string, any>
): Promise<T> {
  try {
    const response = await apiClient({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const api = {
  get: <T,>(url: string) => makeRequest<T>('GET', url),
  post: <T,>(url: string, data?: Record<string, any>) => makeRequest<T>('POST', url, data),
  put: <T,>(url: string, data?: Record<string, any>) => makeRequest<T>('PUT', url, data),
  patch: <T,>(url: string, data?: Record<string, any>) => makeRequest<T>('PATCH', url, data),
  delete: <T,>(url: string) => makeRequest<T>('DELETE', url),
};
