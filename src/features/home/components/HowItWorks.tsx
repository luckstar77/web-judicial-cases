import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import type { ReactElement } from 'react';
import { BRAND_COLORS } from '@/app/theme';

interface Step {
  icon: ReactElement;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  { icon: <ManageSearchIcon />, title: '輸入姓名查判決', description: '輸入房東或房客的完整姓名，查詢公開的租賃糾紛判決、勝訴方與租金。' },
  { icon: <RateReviewOutlinedIcon />, title: '看看網友回報', description: '登入後可用姓名、電話或身分證比對網友回報，了解其他人的真實經驗。' },
  { icon: <BadgeOutlinedIcon />, title: '簽約時當面核對', description: '簽約當下核對身分證正本、撥打對方手機確認門號，降低被冒名的風險。' },
];

export function HowItWorks() {
  return (
    <Container maxWidth="lg" component="section" aria-labelledby="how-it-works-title" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography id="how-it-works-title" variant="h2" sx={{ textAlign: 'center', mb: 1, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
        三步驟，安心簽約
      </Typography>
      <Typography color="text.secondary" sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
        花一分鐘查詢，避免一年的租屋惡夢
      </Typography>
      <Box component="ol" sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, listStyle: 'none', m: 0, p: 0 }}>
        {STEPS.map((step, index) => (
          <Paper key={step.title} component="li" variant="outlined" sx={{ p: 3, borderRadius: '16px', position: 'relative' }}>
            <Stack direction={{ xs: 'row', md: 'column' }} spacing={2} sx={{ alignItems: { xs: 'flex-start', md: 'flex-start' } }}>
              <Box
                aria-hidden
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: '12px',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'primary.main',
                  backgroundColor: BRAND_COLORS.primaryLight,
                }}
              >
                {step.icon}
              </Box>
              <Box>
                <Typography variant="overline" sx={{ color: BRAND_COLORS.accentDark, fontWeight: 700, letterSpacing: '0.1em', lineHeight: 1.5 }}>
                  STEP {index + 1}
                </Typography>
                <Typography variant="h4" component="h3" sx={{ mb: 0.75 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
