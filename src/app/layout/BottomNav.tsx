import AddCircleIcon from '@mui/icons-material/AddCircle';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import GavelIcon from '@mui/icons-material/Gavel';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { BRAND_COLORS } from '@/app/theme';
import { ROUTES } from '@/shared/constants/routes';
import { BOTTOM_NAV_BORDER_WIDTH, BOTTOM_NAV_HEIGHT, BOTTOM_NAV_VALUES, getBottomNavValue } from './nav-items';

const ITEMS = [
  { value: BOTTOM_NAV_VALUES.home, label: '首頁', to: ROUTES.home, icon: <HomeOutlinedIcon /> },
  { value: BOTTOM_NAV_VALUES.judgments, label: '判決', to: ROUTES.judgments, icon: <GavelIcon /> },
  { value: BOTTOM_NAV_VALUES.cases, label: '回報', to: ROUTES.cases, icon: <ForumOutlinedIcon /> },
  { value: BOTTOM_NAV_VALUES.create, label: '發文', to: ROUTES.caseCreate, icon: <AddCircleIcon sx={{ color: BRAND_COLORS.accent }} /> },
  { value: BOTTOM_NAV_VALUES.profile, label: '我的', to: ROUTES.profile, icon: <PersonOutlineIcon /> },
];

/** 手機版底部導覽（< md）。 */
export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <Paper
      component="nav"
      aria-label="底部導覽"
      square
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        borderTop: `${BOTTOM_NAV_BORDER_WIDTH}px solid ${BRAND_COLORS.border}`,
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <BottomNavigation showLabels value={getBottomNavValue(pathname)} sx={{ height: BOTTOM_NAV_HEIGHT }}>
        {ITEMS.map((item) => (
          <BottomNavigationAction key={item.value} value={item.value} label={item.label} icon={item.icon} component={RouterLink} to={item.to} />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
