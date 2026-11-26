import { QueryClient } from '@tanstack/react-query';
import { isApiError } from '@/shared/api/api-error';
import { API_CODES } from '@/shared/constants/api';

const MAX_RETRIES = 2;
const DEFAULT_STALE_TIME_MS = 30_000;
const NON_RETRYABLE_CODES: number[] = [API_CODES.notFound, API_CODES.validation, API_CODES.unauthorized, API_CODES.tooManyRequests];

const shouldRetry = (failureCount: number, error: unknown): boolean => {
  if (isApiError(error) && NON_RETRYABLE_CODES.includes(error.code)) {
    return false;
  }
  return failureCount < MAX_RETRIES;
};

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME_MS,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
