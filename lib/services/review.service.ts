import { api } from '@/lib/api';
import { Review } from '@/lib/types';

export const reviewService = {
  getByProduct: (productId: string) =>
    api.get<Review[]>(`/reviews/${productId}`),

  getMyReview: (productId: string) =>
    api.get<Review | null>(`/reviews/my/${productId}`),

  checkEligible: (productId: string) =>
    api.get<{ eligible: boolean; hasReview: boolean }>(
      `/reviews/eligible/${productId}`,
    ),

  create: (data: { productId: string; rating: number; comment: string }) =>
    api.post<Review>('/reviews', data),

  update: (id: string, data: { rating?: number; comment?: string }) =>
    api.put<Review>(`/reviews/${id}`, data),

  remove: (id: string) => api.delete<{ message: string }>(`/reviews/${id}`),

  getAllAdmin: (params?: Record<string, string>) => {
    const qs = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return api.get<Review[]>(`/reviews/admin/all${qs}`);
  },
};
