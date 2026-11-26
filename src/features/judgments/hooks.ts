import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { WarningNameParams } from '@/shared/api/types';
import { queryKeys } from '@/shared/constants/query-keys';
import { judgmentsApi } from './api';
import { JUDGMENT_PAGE_SIZE } from './constants';

const CITY_STATS_STALE_MS = 30 * 60_000;

export const useJudgmentSearch = (keyword: string, page: number) =>
  useQuery({
    queryKey: queryKeys.judgments.search(keyword, page),
    queryFn: ({ signal }) => judgmentsApi.search({ keyword, page, limit: JUDGMENT_PAGE_SIZE }, signal),
    enabled: keyword.length > 0,
    placeholderData: keepPreviousData,
  });

export const useJudgmentDetail = (id: string) =>
  useQuery({
    queryKey: queryKeys.judgments.detail(id),
    queryFn: ({ signal }) => judgmentsApi.getDetail(id, signal),
    enabled: id.length > 0,
  });

export const useWarningNames = (params: WarningNameParams) =>
  useQuery({
    queryKey: queryKeys.judgments.warningNames(params),
    queryFn: ({ signal }) => judgmentsApi.getWarningNames(params, signal),
    select: (data) => data.list,
    placeholderData: keepPreviousData,
  });

export const useCityStats = () =>
  useQuery({
    queryKey: queryKeys.judgments.cityStats,
    queryFn: ({ signal }) => judgmentsApi.getCityStats(signal),
    select: (data) => data.list,
    staleTime: CITY_STATS_STALE_MS,
  });
