import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Dialog, DialogContent, IconButton, Stack, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import type { AuthResult } from '@/shared/api/types';
import { SITE_NAME } from '@/shared/constants/site';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { SmsLoginForm } from './components/SmsLoginForm';
import { AUTH_TAB_LABELS, AUTH_TABS, type AuthTab } from './constants';

interface AuthDialogProps {
  open: boolean;
  initialTab: AuthTab;
  reason?: string;
  onClose: () => void;
  onAuthenticated: (result: AuthResult) => void;
}

const TAB_ORDER: AuthTab[] = [AUTH_TABS.login, AUTH_TABS.register, AUTH_TABS.sms];
const DIALOG_TITLE_ID = 'auth-dialog-title';

export function AuthDialog({ open, initialTab, reason, onClose, onAuthenticated }: AuthDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [tab, setTab] = useState<AuthTab>(initialTab);

  useEffect(() => {
    if (open) {
      setTab(initialTab);
    }
  }, [open, initialTab]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="xs" aria-labelledby={DIALOG_TITLE_ID}>
      <Box sx={{ px: 3, pt: 3, pb: 1, position: 'relative' }}>
        <Typography id={DIALOG_TITLE_ID} variant="h4" component="h2">
          歡迎使用{SITE_NAME}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          以手機實名驗證，讓每一則回報更可信
        </Typography>
        <IconButton aria-label="關閉" onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Tabs value={tab} onChange={(_event, value: AuthTab) => setTab(value)} variant="fullWidth" sx={{ px: 3, borderBottom: 1, borderColor: 'divider' }}>
        {TAB_ORDER.map((value) => (
          <Tab key={value} value={value} label={AUTH_TAB_LABELS[value]} id={`auth-tab-${value}`} aria-controls={`auth-panel-${value}`} />
        ))}
      </Tabs>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2} role="tabpanel" id={`auth-panel-${tab}`} aria-labelledby={`auth-tab-${tab}`}>
          {reason && <Alert severity="info">{reason}</Alert>}
          {tab === AUTH_TABS.login && <LoginForm onAuthenticated={onAuthenticated} onSwitchTab={setTab} />}
          {tab === AUTH_TABS.register && <RegisterForm onAuthenticated={onAuthenticated} onSwitchTab={setTab} />}
          {tab === AUTH_TABS.sms && <SmsLoginForm onAuthenticated={onAuthenticated} />}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
