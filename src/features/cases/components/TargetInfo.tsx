import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { Box, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { BRAND_COLORS } from '@/app/theme';
import type { CaseListItem } from '@/shared/api/types';
import { EMPTY_FIELD_TEXT } from '../constants';

function Field({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
      <Box sx={{ color: 'text.secondary', display: 'flex' }} aria-hidden>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" component="p">
          {label}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          sx={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', letterSpacing: '0.04em', overflowWrap: 'anywhere' }}
        >
          {value || EMPTY_FIELD_TEXT}
        </Typography>
      </Box>
    </Stack>
  );
}

/** 對象資訊（後端已遮罩）。 */
export function TargetInfo({ item }: { item: Pick<CaseListItem, 'defendantName' | 'defendantPhone' | 'defendantIdNo'> }) {
  return (
    <Paper
      variant="outlined"
      component="section"
      aria-labelledby="target-info-title"
      sx={{ p: 2.5, borderRadius: '16px', backgroundColor: BRAND_COLORS.accentLight, borderColor: '#F3D9AE' }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
        <ShieldOutlinedIcon sx={{ color: BRAND_COLORS.accentDark }} aria-hidden />
        <Typography id="target-info-title" variant="h5" component="h2">
          對象資訊
        </Typography>
        <Typography variant="caption" color="text.secondary">
          已遮罩保護隱私
        </Typography>
      </Stack>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' } }}>
        <Field icon={<PersonOutlineIcon />} label="姓名" value={item.defendantName} />
        <Field icon={<PhoneIphoneOutlinedIcon />} label="電話" value={item.defendantPhone} />
        <Field icon={<BadgeOutlinedIcon />} label="身分證" value={item.defendantIdNo} />
      </Box>
    </Paper>
  );
}
