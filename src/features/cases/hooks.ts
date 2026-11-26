import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateCaseInput, Paginated } from '@/shared/api/types';
import { queryKeys } from '@/shared/constants/query-keys';
import { casesApi } from './api';
import { CASE_PAGE_SIZE, LATEST_CASES_COUNT } from './constants';

const FIRST_PAGE = 1;

const getNextPageParam = <T>(lastPage: Paginated<T>): number | undefined => (lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined);

interface CaseFeedFilters {
  city?: string;
  district?: string;
}

export const useCaseFeed = (filters: CaseFeedFilters, enabled = true) =>
  useInfiniteQuery({
    queryKey: queryKeys.cases.feed(filters),
    queryFn: ({ pageParam, signal }) => casesApi.list({ ...filters, page: pageParam, limit: CASE_PAGE_SIZE }, signal),
    initialPageParam: FIRST_PAGE,
    getNextPageParam,
    enabled,
  });

export const useCaseSearch = (keyword: string, enabled: boolean) =>
  useInfiniteQuery({
    queryKey: queryKeys.cases.search(keyword),
    queryFn: ({ pageParam, signal }) => casesApi.search({ keyword, page: pageParam, limit: CASE_PAGE_SIZE }, signal),
    initialPageParam: FIRST_PAGE,
    getNextPageParam,
    enabled: enabled && keyword.length > 0,
  });

export const useLatestCases = () =>
  useQuery({
    queryKey: queryKeys.cases.feed({ limit: LATEST_CASES_COUNT }),
    queryFn: ({ signal }) => casesApi.list({ page: FIRST_PAGE, limit: LATEST_CASES_COUNT }, signal),
    select: (data) => data.list,
  });

export const useCaseDetail = (id: number) =>
  useQuery({
    queryKey: queryKeys.cases.detail(id),
    queryFn: ({ signal }) => casesApi.getDetail(id, signal),
    enabled: Number.isInteger(id) && id > 0,
  });

export const useCreateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCaseInput) => casesApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cases.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });
};
