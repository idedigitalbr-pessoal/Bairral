import { apiClient } from '../api/client';
import {
  Report,
  ReportFilters,
  PaginationParams,
  SortParams,
  PaginatedResponse,
  PublicMessage,
  InternalComment,
  ActionPlan,
  Attachment,
  RelatedPerson,
  AuditLog,
} from '../types';

export const reportsService = {
  getReports: async (
    filters?: ReportFilters,
    pagination?: PaginationParams,
    sort?: SortParams
  ): Promise<PaginatedResponse<Report>> => {
    return apiClient.get<PaginatedResponse<Report>>('/reports', {
      params: {
        ...filters,
        page: pagination?.page,
        limit: pagination?.limit,
        sortBy: sort?.sortBy,
        sortOrder: sort?.sortOrder,
      },
    });
  },

  getReportById: async (id: string): Promise<Report> => {
    return apiClient.get<Report>(`/reports/${id}`);
  },

  updateReport: async (id: string, updates: Partial<Report>): Promise<Report> => {
    return apiClient.patch<Report>(`/reports/${id}`, updates);
  },

  addPublicMessage: async (id: string, content: string, senderType: 'COMMITTEE' | 'REPORTER' = 'COMMITTEE'): Promise<PublicMessage> => {
    return apiClient.post<PublicMessage>(`/reports/${id}/messages`, { content, senderType });
  },

  addInternalComment: async (id: string, content: string): Promise<InternalComment> => {
    return apiClient.post<InternalComment>(`/reports/${id}/comments`, { content });
  },

  addActionPlan: async (
    id: string,
    actionPlan: Omit<ActionPlan, 'id' | 'reportId' | 'createdAt' | 'updatedAt'>
  ): Promise<ActionPlan> => {
    return apiClient.post<ActionPlan>(`/reports/${id}/action-plans`, actionPlan);
  },

  addEvidence: async (
    id: string,
    evidence: { fileName: string; fileSize: number; mimeType: string; url?: string }
  ): Promise<Attachment> => {
    return apiClient.post<Attachment>(`/reports/${id}/evidences`, evidence);
  },

  addRelatedPerson: async (
    id: string,
    person: Omit<RelatedPerson, 'id'>
  ): Promise<RelatedPerson> => {
    return apiClient.post<RelatedPerson>(`/reports/${id}/related-people`, person);
  },

  declareConflict: async (
    id: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>(`/reports/${id}/conflict-of-interest`, { reason });
  },

  getReportAuditLogs: async (id: string): Promise<AuditLog[]> => {
    return apiClient.get<AuditLog[]>(`/reports/${id}/audit-logs`);
  },
};
