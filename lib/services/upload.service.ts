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

    return data.url;
  },
};
