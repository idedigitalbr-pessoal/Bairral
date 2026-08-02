import { apiClient } from '../api/client';
import { mockReports } from '../mocks/data';
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
  RiskLevelEnum,
  ReportStatusEnum,
} from '../types';

export const reportsService = {
  getReports: async (
    filters?: ReportFilters,
    pagination?: PaginationParams,
    sort?: SortParams
  ): Promise<PaginatedResponse<Report>> => {
    try {
      return await apiClient.get<PaginatedResponse<Report>>('/reports', {
        params: {
          ...filters,
          page: pagination?.page,
          limit: pagination?.limit,
          sortBy: sort?.sortBy,
          sortOrder: sort?.sortOrder,
        },
      });
    } catch (error) {
      console.warn('Usando manifestações mockadas devido a falha de API/rede:', error);
      let list = [...mockReports];

      if (filters?.search) {
        const s = filters.search.toLowerCase();
        list = list.filter(
          (r) =>
            r.protocol.toLowerCase().includes(s) ||
            r.title.toLowerCase().includes(s) ||
            r.description.toLowerCase().includes(s)
        );
      }

      if (filters?.assignedToMe) {
        list = list.filter((r) => r.assignments.some((a) => a.assigneeId === 'user-1'));
      }

      if (filters?.criticalOnly) {
        list = list.filter((r) => r.riskLevel === RiskLevelEnum.CRITICAL || r.riskLevel === RiskLevelEnum.HIGH);
      }

      if (filters?.delayedOnly) {
        list = list.filter(
          (r) =>
            new Date(r.slaDueDate) < new Date() &&
            r.status !== ReportStatusEnum.RESOLVED &&
            r.status !== ReportStatusEnum.COMPLETED
        );
      }

      if (filters?.status && filters.status.length > 0) {
        list = list.filter((r) => filters.status!.includes(r.status));
      }

      if (filters?.riskLevel && filters.riskLevel.length > 0) {
        list = list.filter((r) => filters.riskLevel!.includes(r.riskLevel));
      }

      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedData = list.slice(startIndex, startIndex + limit);

      return {
        data: paginatedData,
        meta: {
          page,
          limit,
          totalItems: total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    }
  },

  getReportById: async (id: string): Promise<Report> => {
    try {
      return await apiClient.get<Report>(`/reports/${id}`);
    } catch (error) {
      console.warn('Usando manifestação mockada por ID:', error);
      const found = mockReports.find((r) => r.id === id || r.protocol === id) || mockReports[0];
      return found;
    }
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
