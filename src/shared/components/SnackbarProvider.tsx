import { Alert, Snackbar } from '@mui/material';
import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { SnackbarContext, type SnackbarContextValue, type SnackbarSeverity } from '@/shared/hooks/snackbar-context';

const AUTO_HIDE_MS = 4000;

interface SnackbarState {
  key: number;
  message: string;
  severity: SnackbarSeverity;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);
  const [open, setOpen] = useState(false);

  const showMessage = useCallback((message: string, severity: SnackbarSeverity = 'success') => {
    setSnackbar({ key: Date.now(), message, severity });
    setOpen(true);
  }, []);

  const value = useMemo<SnackbarContextValue>(() => ({ showMessage }), [showMessage]);

  const handleClose = (_event?: unknown, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        key={snackbar?.key}
        open={open}
        autoHideDuration={AUTO_HIDE_MS}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 88, md: 24 } }}
      >
        <Alert onClose={handleClose} severity={snackbar?.severity ?? 'success'} variant="filled" sx={{ width: '100%', alignItems: 'center' }}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
