import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Comment, LikeState, ListResult } from '@/shared/api/types';
import { queryKeys } from '@/shared/constants/query-keys';
import { engagementApi } from './api';
import type { EngagementTarget } from './types';

const detailKey = (target: EngagementTarget) => (target.kind === 'case' ? queryKeys.cases.detail(target.id) : queryKeys.judgments.detail(target.id));

export const useComments = (target: EngagementTarget) =>
  useQuery({
    queryKey: queryKeys.engagement.comments(target.kind, target.id),
    queryFn: ({ signal }) => engagementApi.getComments(target, signal),
    select: (data) => data.list,
  });

export const useCreateComment = (target: EngagementTarget) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => engagementApi.createComment(target, content),
    onSuccess: (comment) => {
      queryClient.setQueryData<ListResult<Comment>>(queryKeys.engagement.comments(target.kind, target.id), (previous) => ({
        list: [...(previous?.list ?? []), comment],
      }));
      void queryClient.invalidateQueries({ queryKey: detailKey(target) });
    },
  });
};

export const useLikeState = (target: EngagementTarget, initialCount?: number) =>
  useQuery({
    queryKey: queryKeys.engagement.likes(target.kind, target.id),
    queryFn: ({ signal }) => engagementApi.getLikeState(target, signal),
    placeholderData: initialCount === undefined ? undefined : { likeCount: initialCount, liked: false },
  });

/** 按讚切換：樂觀更新，失敗時回滾。 */
export const useToggleLike = (target: EngagementTarget) => {
  const queryClient = useQueryClient();
  const key = queryKeys.engagement.likes(target.kind, target.id);
  return useMutation({
    mutationFn: () => engagementApi.toggleLike(target),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<LikeState>(key);
      if (previous) {
        queryClient.setQueryData<LikeState>(key, {
          liked: !previous.liked,
          likeCount: Math.max(0, previous.likeCount + (previous.liked ? -1 : 1)),
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSuccess: (state) => {
      queryClient.setQueryData(key, state);
    },
  });
};
