import type { CaseListParams, WarningNameParams } from '@/shared/api/types';

export type EngagementKind = 'judgment' | 'case';

/** 所有 TanStack Query key 集中管理，方便 invalidate。 */
export const queryKeys = {
  stats: ['stats'] as const,
  me: ['users', 'me'] as const,
  judgments: {
    all: ['judgments'] as const,
    search: (keyword: string, page: number) => ['judgments', 'search', { keyword, page }] as const,
    detail: (id: string) => ['judgments', 'detail', id] as const,
    warningNames: (params: WarningNameParams) => ['judgments', 'warning-names', params] as const,
    cityStats: ['judgments', 'city-stats'] as const,
  },
  cases: {
    all: ['cases'] as const,
    feed: (filters: Omit<CaseListParams, 'page'>) => ['cases', 'feed', filters] as const,
    search: (keyword: string) => ['cases', 'search', keyword] as const,
    detail: (id: number) => ['cases', 'detail', id] as const,
  },
  engagement: {
    all: ['engagement'] as const,
    likesAll: ['engagement', 'likes'] as const,
    likes: (kind: EngagementKind, id: string | number) => ['engagement', 'likes', kind, String(id)] as const,
    comments: (kind: EngagementKind, id: string | number) => ['engagement', 'comments', kind, String(id)] as const,
  },
} as const;
