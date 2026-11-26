import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { SITE_NAME } from '@/shared/constants/site';

const LOGO_SRC = '/rental_icon.png';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Box
      component={RouterLink}
      to={ROUTES.home}
      aria-label={`${SITE_NAME} 首頁`}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        color: 'text.primary',
        textDecoration: 'none',
        borderRadius: '8px',
        '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.light' },
      }}
    >
      <Box component="img" src={LOGO_SRC} alt="" sx={{ width: compact ? 28 : 32, height: compact ? 28 : 32, borderRadius: '8px' }} />
      <Typography component="span" sx={{ fontWeight: 800, fontSize: compact ? '1.125rem' : '1.25rem', letterSpacing: '0.06em', color: 'primary.main' }}>
        {SITE_NAME}
      </Typography>
    </Box>
  );
}
