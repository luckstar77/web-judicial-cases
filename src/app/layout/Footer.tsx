import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link as RouterLink } from 'react-router-dom';
import { DISCLAIMER_TEXT, FACEBOOK_PAGE_URL, GITHUB_API_REPO_URL, GITHUB_WEB_REPO_URL, SITE_NAME } from '@/shared/constants/site';
import { Logo } from './Logo';
import { DESKTOP_NAV_ITEMS } from './nav-items';

const EXTERNAL_LINKS = [
  { label: '粉絲專頁', href: FACEBOOK_PAGE_URL },
  { label: 'GitHub・前端', href: GITHUB_WEB_REPO_URL },
  { label: 'GitHub・後端 API', href: GITHUB_API_REPO_URL },
];

const linkSx = {
  color: 'text.secondary',
  textDecoration: 'none',
  typography: 'body2',
  '&:hover': { color: 'primary.main', textDecoration: 'underline' },
} as const;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <Box component="footer" sx={{ backgroundColor: 'background.paper', borderTop: 1, borderColor: 'divider', mt: 'auto' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={{ xs: 3, md: 6 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Logo compact />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxWidth: 440 }}>
              {DISCLAIMER_TEXT}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="subtitle2" component="h2" sx={{ mb: 1.5 }}>
              網站導覽
            </Typography>
            <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {DESKTOP_NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link component={RouterLink} to={item.to} sx={linkSx}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="subtitle2" component="h2" sx={{ mb: 1.5 }}>
              社群與原始碼
            </Typography>
            <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {EXTERNAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} target="_blank" rel="noopener noreferrer" sx={linkSx}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" color="text.secondary">
          © {year} {SITE_NAME}・資訊互通、風險減少
        </Typography>
      </Container>
    </Box>
  );
}
