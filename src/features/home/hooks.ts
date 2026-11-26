import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { statsApi } from './api';

const STATS_STALE_MS = 5 * 60_000;

export const useSiteStats = () =>
  useQuery({
    queryKey: queryKeys.stats,
    queryFn: ({ signal }) => statsApi.get(signal),
    staleTime: STATS_STALE_MS,
  });
