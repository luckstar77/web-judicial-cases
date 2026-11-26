import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { type MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND_COLORS } from '@/app/theme';
import { useAuth } from '@/features/auth/auth-context';
import { formatPhoneForDisplay } from '@/features/auth/phone';
import { ROUTES } from '@/shared/constants/routes';

const MENU_ID = 'user-menu';
const DEFAULT_NAME = '會員';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const name = user?.displayName || user?.name || DEFAULT_NAME;
  const open = Boolean(anchorEl);

  const go = (path: string) => {
    setAnchorEl(null);
    navigate(path);
  };

  return (
    <>
      <IconButton
        aria-label="帳號選單"
        aria-controls={open ? MENU_ID : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={(event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)}
        sx={{ p: 0.5 }}
      >
        <Avatar sx={{ width: 36, height: 36, bgcolor: BRAND_COLORS.primaryLight, color: 'primary.main', fontSize: '1rem', fontWeight: 700 }}>
          {name.slice(0, 1)}
        </Avatar>
      </IconButton>
      <Menu
        id={MENU_ID}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { variant: 'outlined', sx: { mt: 1, minWidth: 220, borderRadius: '12px' } } }}
      >
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography variant="subtitle1" noWrap>
            {name}
          </Typography>
          {user?.phone && (
            <Typography variant="caption" color="text.secondary">
              {formatPhoneForDisplay(user.phone)}
            </Typography>
          )}
        </Box>
        <Divider />
        <MenuItem onClick={() => go(ROUTES.profile)}>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          我的帳號
        </MenuItem>
        <MenuItem onClick={() => go(ROUTES.caseCreate)}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          我要回報
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            signOut();
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          登出
        </MenuItem>
      </Menu>
    </>
  );
}
