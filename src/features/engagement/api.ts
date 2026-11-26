import { apiGet, apiPost } from '@/shared/api/client';
import type { Comment, LikeState, ListResult } from '@/shared/api/types';
import { API_PATHS } from '@/shared/constants/api';
import type { EngagementTarget } from './types';

interface EndpointConfig {
  comments: string;
  likes: string;
  toggle: string;
  idParam: string;
}

const ENDPOINTS: Record<EngagementTarget['kind'], EndpointConfig> = {
  judgment: {
    comments: API_PATHS.judgmentComments,
    likes: API_PATHS.judgmentLikes,
    toggle: API_PATHS.judgmentLikesToggle,
    idParam: 'filesetId',
  },
  case: {
    comments: API_PATHS.caseComments,
    likes: API_PATHS.caseLikes,
    toggle: API_PATHS.caseLikesToggle,
    idParam: 'caseId',
  },
};

const idPayload = (target: EngagementTarget) => ({ [ENDPOINTS[target.kind].idParam]: target.id });

export const engagementApi = {
  getComments: (target: EngagementTarget, signal?: AbortSignal) => apiGet<ListResult<Comment>>(ENDPOINTS[target.kind].comments, idPayload(target), signal),
  createComment: (target: EngagementTarget, content: string) => apiPost<Comment>(ENDPOINTS[target.kind].comments, { ...idPayload(target), content }),
  getLikeState: (target: EngagementTarget, signal?: AbortSignal) => apiGet<LikeState>(ENDPOINTS[target.kind].likes, idPayload(target), signal),
  toggleLike: (target: EngagementTarget) => apiPost<LikeState>(ENDPOINTS[target.kind].toggle, idPayload(target)),
};
