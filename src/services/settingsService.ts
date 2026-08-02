import { apiClient } from '../api/client';

export interface SystemSettings {
  institutional: {
    organizationName: string;
    cnpj: string;
    address: string;
    ethicsEmail: string;
    dpoName: string;
    dpoEmail: string;
  };
  slaDefaults: {
    criticalTriageDays: number;
    normalTriageDays: number;
    finalResolutionDays: number;
    maxExtensionDays: number;
  };
  policies: {
    privacyTerms: string;
    antiRetaliationPolicy: string;
    anonymityGuidelines: string;
  };
  messageTemplates: {
    receiptConfirmation: string;
    infoRequest: string;
    extensionNotice: string;
    closureNotice: string;
  };
  retention: {
    retentionYears: number;
    autoPurgeSensitiveEvidence: boolean;
  };
  alternativeChannels: {
    phone0800: string;
    whatsappNumber: string;
    physicalBoxLocations: string;
  };
  notifications: {
    notifyCriticalCasesImmediately: boolean;
    notifySlaWarning24h: boolean;
    weeklyCommitteeDigest: boolean;
  };
}

export const settingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    return apiClient.get<SystemSettings>('/settings');
  },
  updateSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    return apiClient.put<SystemSettings>('/settings', settings);
  },
};
