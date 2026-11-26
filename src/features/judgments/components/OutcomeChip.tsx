import BalanceIcon from '@mui/icons-material/Balance';
import { Chip } from '@mui/material';
import type { JudgmentListItem } from '@/shared/api/types';
import { getJudgmentOutcome } from '../outcome';

export function OutcomeChip({ judgment }: { judgment: Pick<JudgmentListItem, 'win' | 'plaintiff' | 'defendant'> }) {
  const outcome = getJudgmentOutcome(judgment);
  return (
    <Chip
      size="small"
      variant="outlined"
      color={outcome.hasWinner ? 'primary' : 'default'}
      icon={<BalanceIcon />}
      label={outcome.label}
      sx={{ fontWeight: 600, backgroundColor: outcome.hasWinner ? 'rgba(14,94,111,0.06)' : undefined }}
    />
  );
}
