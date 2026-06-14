import { api } from '@/lib/api';
import { Banner } from '@/lib/types';

export const bannerService = {
  /** Active banners for shop / home (public). */
  getActive: () => api.get<Banner[]>('/banners?activeOnly=true'),
  getAll: () => api.get<Banner[]>('/banners'),
  create: (data: Partial<Banner>) => api.post<Banner>('/banners', data),
  update: (id: string, data: Partial<Banner>) =>
    api.put<Banner>(`/banners/${id}`, data),
  remove: (id: string) =>
    api.delete<{ message: string }>(`/banners/${id}`),
};
