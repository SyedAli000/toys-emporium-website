import { api } from '@/lib/api';
import { Category } from '@/lib/types';

export const categoryService = {
  getAll: () => api.get<Category[]>('/categories'),
  getOne: (id: string) => api.get<Category>(`/categories/${id}`),
  create: (data: Partial<Category>) => api.post<Category>('/categories', data),
  update: (id: string, data: Partial<Category>) =>
    api.put<Category>(`/categories/${id}`, data),
  remove: (id: string) =>
    api.delete<{ message: string }>(`/categories/${id}`),
};
