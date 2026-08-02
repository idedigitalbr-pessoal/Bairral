import { apiClient } from '../api/client';
import { Category } from '../types';

export const categoriesService = {
  getCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories');
  },
  createCategory: async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'reportCount'>): Promise<Category> => {
    return apiClient.post<Category>('/categories', category);
  },
  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category> => {
    return apiClient.put<Category>(`/categories/${id}`, updates);
  },
  toggleCategoryActive: async (id: string, active: boolean): Promise<Category> => {
    return apiClient.patch<Category>(`/categories/${id}/active`, { active });
  },
  deleteCategory: async (id: string): Promise<{ id: string }> => {
    return apiClient.delete<{ id: string }>(`/categories/${id}`);
  },
};
