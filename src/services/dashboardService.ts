import { apiClient } from '../api/client';
import { DashboardMetrics, DashboardFilters } from '../types';

export const dashboardService = {
  getMetrics: async (filters?: DashboardFilters): Promise<DashboardMetrics> => {
    return apiClient.get<DashboardMetrics>('/dashboard/metrics', {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },
};
