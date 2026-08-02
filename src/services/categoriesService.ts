import { apiClient } from '../api/client';
import { Category } from '../types';
import { mockCategories } from '../mocks/data';

export const categoriesService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      return await apiClient.get<Category[]>('/categories');
    } catch (error) {
      console.warn('Usando categorias mockadas devido a erro de rede:', error);
      return mockCategories;
    }
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

