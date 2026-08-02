import { apiClient } from '../api/client';
import { Report } from '../types';

export interface RegisterPublicReportPayload {
  title: string;
  description: string;
  type: string;
  registrationType: string;
  categoryId: string;
  unitId: string;
  reporter?: {
    type: string;
    name?: string;
    email?: string;
    phone?: string;
    relationshipToHospital?: string;
  };
  attachments?: any[];
}

export interface RegisterPublicReportResponse {
  protocol: string;
  accessKey: string;
  report: Report;
}

export interface TrackPublicReportPayload {
  protocol: string;
  accessKey: string;
}

export interface PublicTimelineItem {
  id: string;
  title: string;
  description?: string;
  status?: string;
  date: string;
  type: 'STATUS_CHANGE' | 'MESSAGE' | 'SYSTEM' | 'REPORTER_REPLY';
}

export interface PublicMessageItem {
  id: string;
  reportId?: string;
  senderType: 'COMMITTEE' | 'REPORTER' | 'SYSTEM';
  senderName: string;
  content: string;
  isInformationRequest?: boolean;
  attachments?: Array<{
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url?: string;
  }>;
  createdAt: string;
}

export interface TrackPublicReportResponse {
  protocol: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  slaDueDate: string;
  categoryName: string;
  unitName: string;
  isClosed: boolean;
  publicMessages: PublicMessageItem[];
  timeline: PublicTimelineItem[];
}

export interface SendPublicReplyPayload {
  protocol: string;
  accessKey: string;
  message: string;
  attachments?: Array<{
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url?: string;
  }>;
}

export interface ClosePublicReportPayload {
  protocol: string;
  accessKey: string;
}

export const publicService = {
  registerReport: async (payload: RegisterPublicReportPayload): Promise<RegisterPublicReportResponse> => {
    return apiClient.post<RegisterPublicReportResponse>('/public/reports', payload);
  },
  trackReport: async (payload: TrackPublicReportPayload): Promise<TrackPublicReportResponse> => {
    return apiClient.post<TrackPublicReportResponse>('/public/reports/track', payload);
  },
  sendReply: async (payload: SendPublicReplyPayload): Promise<TrackPublicReportResponse> => {
    return apiClient.post<TrackPublicReportResponse>('/public/reports/reply', payload);
  },
  closeReport: async (payload: ClosePublicReportPayload): Promise<TrackPublicReportResponse> => {
    return apiClient.post<TrackPublicReportResponse>('/public/reports/close', payload);
  },
};

