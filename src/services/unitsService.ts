import { apiClient } from '../api/client';
import { Unit, Department } from '../types';

export const unitsService = {
  getUnits: async (): Promise<Unit[]> => {
    return apiClient.get<Unit[]>('/units');
  },
  createUnit: async (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Unit> => {
    return apiClient.post<Unit>('/units', unit);
  },
  updateUnit: async (id: string, updates: Partial<Unit>): Promise<Unit> => {
    return apiClient.put<Unit>(`/units/${id}`, updates);
  },
  deleteUnit: async (id: string): Promise<{ id: string }> => {
    return apiClient.delete<{ id: string }>(`/units/${id}`);
  },
  getDepartments: async (unitId?: string): Promise<Department[]> => {
    return apiClient.get<Department[]>('/departments', { params: { unitId } });
  },
  createDepartment: async (dept: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> => {
    return apiClient.post<Department>('/departments', dept);
  },
  updateDepartment: async (id: string, updates: Partial<Department>): Promise<Department> => {
    return apiClient.put<Department>(`/departments/${id}`, updates);
  },
  deleteDepartment: async (id: string): Promise<{ id: string }> => {
    return apiClient.delete<{ id: string }>(`/departments/${id}`);
  },
};
