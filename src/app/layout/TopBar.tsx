import AddIcon from '@mui/icons-material/Add';
import { AppBar, Box, Button, Container, Stack, Toolbar } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { BRAND_COLORS } from '@/app/theme';
import { useAuth } from '@/features/auth/auth-context';
import { ROUTES } from '@/shared/constants/routes';
import { Logo } from './Logo';
import { DESKTOP_NAV_ITEMS, isNavActive } from './nav-items';
import { UserMenu } from './UserMenu';

export function TopBar() {
  const { pathname } = useLocation();
  const { isAuthenticated, openAuthDialog } = useAuth();

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 }, gap: 2 }}>
          <Logo />
          <Box component="nav" aria-label="主要導覽" sx={{ display: { xs: 'none', md: 'flex' }, ml: 3, gap: 0.5 }}>
            {DESKTOP_NAV_ITEMS.map((item) => {
              const active = isNavActive(pathname, item.to);
              return (
                <Button
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  sx={{
                    color: active ? 'primary.main' : 'text.secondary',
                    fontWeight: active ? 700 : 500,
                    position: 'relative',
                    px: 1.5,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 12,
                      right: 12,
                      bottom: 2,
                      height: 2,
                      borderRadius: '4px',
                      backgroundColor: active ? BRAND_COLORS.primary : 'transparent',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
          <Box sx={{ flex: 1 }} />
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Button
              component={RouterLink}
              to={ROUTES.caseCreate}
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            >
              我要回報
            </Button>
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Button variant="outlined" onClick={() => openAuthDialog()} sx={{ minWidth: 0, px: { xs: 1.75, md: 2.25 } }}>
                登入
              </Button>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
