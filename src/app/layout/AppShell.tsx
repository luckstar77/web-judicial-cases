import { Box } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { RouteProgress } from '@/shared/components/RouteProgress';
import { trackPageView } from '@/shared/utils/analytics';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { BOTTOM_NAV_OFFSET } from './nav-items';
import { TopBar } from './TopBar';

const MAIN_CONTENT_ID = 'main-content';

export function AppShell() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', pb: { xs: BOTTOM_NAV_OFFSET, md: 0 } }}>
      <Box
        component="a"
        href={`#${MAIN_CONTENT_ID}`}
        sx={{
          position: 'absolute',
          left: 8,
          top: -48,
          zIndex: (theme) => theme.zIndex.tooltip,
          px: 2,
          py: 1,
          borderRadius: '8px',
          bgcolor: 'primary.main',
          color: '#fff',
          '&:focus': { top: 8 },
        }}
      >
        跳到主要內容
      </Box>
      <RouteProgress />
      <TopBar />
      <Box component="main" id={MAIN_CONTENT_ID} tabIndex={-1} sx={{ flex: 1, outline: 'none' }}>
        <Outlet />
      </Box>
      <Footer />
      <BottomNav />
      <ScrollRestoration />
    </Box>
  );
}
