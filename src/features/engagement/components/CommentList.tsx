import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Avatar, Box, Skeleton, Stack, Typography } from '@mui/material';
import { BRAND_COLORS } from '@/app/theme';
import type { Comment } from '@/shared/api/types';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { formatRelativeTime } from '@/shared/utils/format-date';
import { useComments } from '../hooks';
import type { EngagementTarget } from '../types';

const ANONYMOUS_NAME = '匿名網友';
const SKELETON_COUNT = 2;

function CommentItem({ comment, floor }: { comment: Comment; floor: number }) {
  const name = comment.authorDisplayName || ANONYMOUS_NAME;
  return (
    <Stack direction="row" spacing={1.5} component="li" sx={{ py: 2, '&:not(:last-of-type)': { borderBottom: `1px solid ${BRAND_COLORS.border}` } }}>
      <Avatar sx={{ width: 36, height: 36, bgcolor: BRAND_COLORS.primaryLight, color: 'primary.main', fontSize: '0.9375rem' }} aria-hidden>
        {name.slice(0, 1)}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', flexWrap: 'wrap', columnGap: 1 }}>
          <Typography variant="subtitle2" component="span">
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="span">
            B{floor} · <time dateTime={comment.createdAt}>{formatRelativeTime(comment.createdAt)}</time>
            {comment.ipMasked && ` · 來自 ${comment.ipMasked}`}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          {comment.content}
        </Typography>
      </Box>
    </Stack>
  );
}

export function CommentList({ target }: { target: EngagementTarget }) {
  const { data, isPending, isError, error, refetch } = useComments(target);

  if (isPending) {
    return (
      <Stack spacing={2} sx={{ py: 2 }} aria-label="留言載入中">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <Stack key={index} direction="row" spacing={1.5}>
            <Skeleton variant="circular" width={36} height={36} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="30%" />
              <Skeleton width="90%" />
            </Box>
          </Stack>
        ))}
      </Stack>
    );
  }

  if (isError) {
    return <ErrorState compact error={error} title="留言載入失敗" onRetry={() => void refetch()} />;
  }

  if (data.length === 0) {
    return <EmptyState compact icon={<ChatBubbleOutlineIcon />} title="還沒有留言" description="成為第一個分享經驗的人吧！" />;
  }

  return (
    <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }} aria-label="留言列表">
      {data.map((comment, index) => (
        <CommentItem key={comment.id} comment={comment} floor={index + 1} />
      ))}
    </Box>
  );
}
