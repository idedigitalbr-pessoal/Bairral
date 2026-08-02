import { apiClient } from '../api/client';
import { AdminUser, AdminRole } from '../types/auth';

// NOTA DE ARQUITETURA:
// A autorização e validação real de senhas e tokens JWT serão processadas pelo Backend NestJS em produção.
// Este serviço interage com endpoints simulados via MSW na fase atual.

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface FirstAccessPayload {
  email: string;
  temporaryPassword?: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },
  getMe: async (): Promise<AdminUser> => {
    return apiClient.get<AdminUser>('/auth/me');
  },
  logout: async (): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/logout');
  },
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/forgot-password', payload);
  },
  resetPassword: async (payload: ResetPasswordPayload): Promise<{ message: string; user: AdminUser }> => {
    return apiClient.post<{ message: string; user: AdminUser }>('/auth/reset-password', payload);
  },
  firstAccess: async (payload: FirstAccessPayload): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/first-access', payload);
  },
  changePassword: async (payload: ChangePasswordPayload): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/change-password', payload);
  },
  switchSimulatedRole: async (role: AdminRole): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/switch-role', { role });
  },
};
