import { apiClient } from '../api/client';
import { AuditLog, AuditLogFilters, PaginationParams, PaginatedResponse } from '../types';

export const auditService = {
  getAuditLogs: async (
    filters?: AuditLogFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<AuditLog>> => {
    return apiClient.get<PaginatedResponse<AuditLog>>('/audit-logs', {
      params: {
        ...filters,
        page: pagination?.page,
        limit: pagination?.limit,
      },
    });
  },
};
