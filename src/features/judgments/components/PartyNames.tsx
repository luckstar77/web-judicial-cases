import { Box, Stack, Typography } from '@mui/material';
import { BRAND_COLORS } from '@/app/theme';
import type { JudgmentListItem } from '@/shared/api/types';
import { isSameName } from '@/shared/utils/highlight';

const UNKNOWN_PARTY = '未記載';

interface PartyProps {
  role: string;
  name?: string;
  keyword?: string;
  isWinner: boolean;
}

function Party({ role, name, keyword, isWinner }: PartyProps) {
  const matched = isSameName(name, keyword);
  return (
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography variant="caption" color="text.secondary" component="p">
        {role}
        {isWinner && (
          <Box component="span" sx={{ ml: 0.75, color: BRAND_COLORS.success, fontWeight: 700 }}>
            勝訴
          </Box>
        )}
      </Typography>
      <Typography variant="subtitle1" component="p" sx={{ overflowWrap: 'anywhere', fontSize: '1.0625rem' }}>
        {matched ? <mark>{name}</mark> : name || UNKNOWN_PARTY}
      </Typography>
    </Box>
  );
}

interface PartyNamesProps {
  judgment: Pick<JudgmentListItem, 'plaintiff' | 'defendant' | 'win'>;
  keyword?: string;
}

/** 原告 vs 被告，搜尋的姓名以 `<mark>` 標示。 */
export function PartyNames({ judgment, keyword }: PartyNamesProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignItems: 'center', p: 1.5, borderRadius: '12px', backgroundColor: BRAND_COLORS.background, border: `1px solid ${BRAND_COLORS.border}` }}
    >
      <Party role="原告" name={judgment.plaintiff} keyword={keyword} isWinner={judgment.win === 'plaintiff'} />
      <Typography aria-hidden color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.8125rem', px: 0.5 }}>
        VS
      </Typography>
      <Party role="被告" name={judgment.defendant} keyword={keyword} isWinner={judgment.win === 'defendant'} />
    </Stack>
  );
}
