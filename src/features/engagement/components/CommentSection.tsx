import { Paper, Stack, Typography } from '@mui/material';
import { formatNumber } from '@/shared/utils/format-number';
import { useComments } from '../hooks';
import type { EngagementTarget } from '../types';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

interface CommentSectionProps {
  target: EngagementTarget;
  initialCount?: number;
}

export function CommentSection({ target, initialCount }: CommentSectionProps) {
  const { data } = useComments(target);
  const count = data?.length ?? initialCount ?? 0;
  return (
    <Paper variant="outlined" component="section" aria-labelledby="comment-section-title" sx={{ p: { xs: 2, md: 3 }, borderRadius: '16px' }}>
      <Stack spacing={2}>
        <Typography id="comment-section-title" variant="h4" component="h2">
          留言討論{' '}
          <Typography component="span" variant="h4" color="text.secondary" sx={{ fontWeight: 500 }}>
            ({formatNumber(count)})
          </Typography>
        </Typography>
        <CommentForm target={target} />
        <CommentList target={target} />
      </Stack>
    </Paper>
  );
}
