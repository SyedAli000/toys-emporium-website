import { api } from '@/lib/api';
import { User } from '@/lib/types';

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post<{ token: string; user: User }>('/auth/register', {
      name,
      email,
      password,
    }),
  verify: () => api.get<{ user: User }>('/auth/verify'),
  logout: () => api.post<{ message: string }>('/auth/logout'),
  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, password }),
};
