import { apiClient } from '../api/client';
import { User, Role, AdminPermission } from '../types';

export interface CreateUserDto {
  name: string;
  email: string;
  roleId: string;
  unitId?: string;
  departmentId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  roleId?: string;
  unitId?: string;
  departmentId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface CreateRoleDto {
  name: string;
  description: string;
  permissions: AdminPermission[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: AdminPermission[];
}

export const usersService = {
  getUsers: async (search?: string): Promise<User[]> => {
    return apiClient.get<User[]>('/users', { params: { search } });
  },
  getUserById: async (id: string): Promise<User> => {
    return apiClient.get<User>(`/users/${id}`);
  },
  createUser: async (data: CreateUserDto): Promise<User> => {
    return apiClient.post<User>('/users', data);
  },
  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    return apiClient.put<User>(`/users/${id}`, data);
  },
  toggleUserStatus: async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): Promise<User> => {
    return apiClient.patch<User>(`/users/${id}/status`, { status });
  },
  getRoles: async (): Promise<Role[]> => {
    return apiClient.get<Role[]>('/roles');
  },
  createRole: async (data: CreateRoleDto): Promise<Role> => {
    return apiClient.post<Role>('/roles', data);
  },
  updateRole: async (id: string, data: UpdateRoleDto): Promise<Role> => {
    return apiClient.put<Role>(`/roles/${id}`, data);
  },
};
