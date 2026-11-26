import { apiGet } from '@/shared/api/client';
import type {
  CityStat,
  JudgmentDetail,
  JudgmentListItem,
  JudgmentSearchParams,
  ListResult,
  Paginated,
  WarningName,
  WarningNameParams,
} from '@/shared/api/types';
import { API_PATHS } from '@/shared/constants/api';

export const judgmentsApi = {
  search: (params: JudgmentSearchParams, signal?: AbortSignal) =>
    apiGet<Paginated<JudgmentListItem>>(API_PATHS.judgments, { keyword: params.keyword, page: params.page, limit: params.limit }, signal),
  getDetail: (id: string, signal?: AbortSignal) => apiGet<JudgmentDetail>(API_PATHS.judgmentDetail, { id }, signal),
  getWarningNames: (params: WarningNameParams, signal?: AbortSignal) =>
    apiGet<ListResult<WarningName>>(
      API_PATHS.warningNames,
      { city: params.city, rentMin: params.rentMin, rentMax: params.rentMax, minCount: params.minCount },
      signal,
    ),
  getCityStats: (signal?: AbortSignal) => apiGet<ListResult<CityStat>>(API_PATHS.cityStats, undefined, signal),
};
