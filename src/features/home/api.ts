import { apiGet } from '@/shared/api/client';
import type { SiteStats } from '@/shared/api/types';
import { API_PATHS } from '@/shared/constants/api';

export const statsApi = {
  get: (signal?: AbortSignal) => apiGet<SiteStats>(API_PATHS.stats, undefined, signal),
};
