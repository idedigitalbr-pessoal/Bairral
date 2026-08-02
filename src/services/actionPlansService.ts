import { apiClient } from '../api/client';
import { ActionPlan } from '../types';

export interface ActionPlanExtended extends ActionPlan {
  reportProtocol?: string;
  reportTitle?: string;
  unitName?: string;
  categoryName?: string;
  daysOverdue?: number;
  validationNotes?: string;
  evidences?: Array<{ id: string; name: string; url: string; uploadedAt: string }>;
}

export interface CreateActionPlanDto {
  reportId?: string;
  title: string;
  description: string;
  responsibleId: string;
  responsibleName: string;
  dueDate: string;
}

export interface UpdateActionPlanDto {
  title?: string;
  description?: string;
  responsibleId?: string;
  responsibleName?: string;
  dueDate?: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  progressPercentage?: number;
  validationNotes?: string;
  evidences?: Array<{ id: string; name: string; url: string; uploadedAt: string }>;
}

export const actionPlansService = {
  getActionPlans: async (params?: Record<string, any>): Promise<ActionPlanExtended[]> => {
    return apiClient.get<ActionPlanExtended[]>('/action-plans', { params });
  },

  getActionPlanById: async (id: string): Promise<ActionPlanExtended> => {
    return apiClient.get<ActionPlanExtended>(`/action-plans/${id}`);
  },

  createActionPlan: async (data: CreateActionPlanDto): Promise<ActionPlanExtended> => {
    return apiClient.post<ActionPlanExtended>('/action-plans', data);
  },

  updateActionPlan: async (id: string, data: UpdateActionPlanDto): Promise<ActionPlanExtended> => {
    return apiClient.put<ActionPlanExtended>(`/action-plans/${id}`, data);
  },

  validateActionPlan: async (
    id: string,
    validation: { status: 'COMPLETED' | 'CANCELLED'; validationNotes: string }
  ): Promise<ActionPlanExtended> => {
    return apiClient.post<ActionPlanExtended>(`/action-plans/${id}/validate`, validation);
  },
};
