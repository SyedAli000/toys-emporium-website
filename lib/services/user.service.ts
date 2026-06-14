import { api } from '@/lib/api';
import { User } from '@/lib/types';

export const userService = {
  getAll: (params?: Record<string, string>) => {
    const qs = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return api.get<User[]>(`/users${qs}`);
  },
  getOne: (id: string) => api.get<User>(`/users/${id}`),
  update: (id: string, data: Partial<User>) =>
    api.put<User>(`/users/${id}`, data),
  updateStatus: (id: string, isActive: boolean) =>
    api.put<User>(`/users/${id}/status`, { isActive }),
};
