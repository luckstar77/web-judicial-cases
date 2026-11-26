import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import GavelIcon from '@mui/icons-material/Gavel';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { Chip, Skeleton, Stack } from '@mui/material';
import type { ReactElement } from 'react';
import { formatNumber } from '@/shared/utils/format-number';
import { useSiteStats } from '../hooks';

const SKELETON_COUNT = 3;

interface StatChipItem {
  key: string;
  icon: ReactElement;
  label: string;
}

export function StatChips() {
  const { data, isPending, isError } = useSiteStats();

  if (isError) {
    return null;
  }

  if (isPending) {
    return (
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'center' }} aria-hidden>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <Skeleton key={index} variant="rounded" width={140} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.18)' }} />
        ))}
      </Stack>
    );
  }

  const items: StatChipItem[] = [
    { key: 'judgments', icon: <GavelIcon />, label: `已收錄 ${formatNumber(data.judgmentCount)} 筆判決` },
    { key: 'cases', icon: <ForumOutlinedIcon />, label: `${formatNumber(data.caseCount)} 則網友回報` },
    { key: 'users', icon: <PeopleOutlineIcon />, label: `${formatNumber(data.userCount)} 位實名會員` },
  ];

  return (
    <Stack component="ul" direction="row" sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'center', listStyle: 'none', m: 0, p: 0 }} aria-label="平台統計">
      {items.map((item) => (
        <li key={item.key}>
          <Chip
            icon={item.icon}
            label={item.label}
            sx={{
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.24)',
              fontWeight: 600,
              '& .MuiChip-icon': { color: '#F6C77A' },
            }}
          />
        </li>
      ))}
    </Stack>
  );
}
