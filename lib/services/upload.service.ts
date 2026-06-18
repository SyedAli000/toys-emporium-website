import { apiClient } from '@/lib/api';

export const uploadService = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<{ url: string; filename: string }>(
      '/uploads',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );

    const url = data.url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        return new URL(url).pathname;
      } catch {
        return url;
      }
    }
    return url.startsWith('/') ? url : `/${url}`;
  },
};
