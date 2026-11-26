import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Button } from '@mui/material';
import { useAuth } from '@/features/auth/auth-context';
import { getErrorMessage } from '@/shared/api/api-error';
import { useSnackbar } from '@/shared/hooks/snackbar-context';
import { formatNumber } from '@/shared/utils/format-number';
import { useLikeState, useToggleLike } from '../hooks';
import type { EngagementTarget } from '../types';

interface LikeButtonProps {
  target: EngagementTarget;
  initialCount?: number;
}

export function LikeButton({ target, initialCount }: LikeButtonProps) {
  const { requireAuth } = useAuth();
  const { showMessage } = useSnackbar();
  const { data } = useLikeState(target, initialCount);
  const toggle = useToggleLike(target);
  const liked = data?.liked ?? false;
  const likeCount = data?.likeCount ?? initialCount ?? 0;

  const handleClick = () => {
    requireAuth(() => {
      toggle.mutate(undefined, { onError: (error) => showMessage(getErrorMessage(error), 'error') });
    }, '登入後即可按讚支持');
  };

  return (
    <Button
      variant={liked ? 'contained' : 'outlined'}
      color={liked ? 'error' : 'inherit'}
      startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      onClick={handleClick}
      aria-pressed={liked}
      aria-label={liked ? `取消按讚，目前 ${likeCount} 個讚` : `按讚，目前 ${likeCount} 個讚`}
      sx={{ borderColor: 'divider', minWidth: 96 }}
    >
      {liked ? '已按讚' : '按讚'} · {formatNumber(likeCount)}
    </Button>
  );
}
