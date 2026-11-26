import { useQuery, useQueryClient } from '@tanstack/react-query';
import { lazy, type ReactNode, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { subscribeUnauthorized } from '@/shared/api/auth-events';
import { tokenStorage } from '@/shared/api/token-storage';
import type { AuthResult } from '@/shared/api/types';
import { queryKeys } from '@/shared/constants/query-keys';
import { useSnackbar } from '@/shared/hooks/snackbar-context';
import { authApi } from './api';
import { AuthContext, type AuthContextValue, type OpenAuthDialogOptions } from './auth-context';
import { AUTH_TABS, type AuthTab } from './constants';

const AuthDialog = lazy(() => import('./AuthDialog').then((module) => ({ default: module.AuthDialog })));

interface DialogState {
  open: boolean;
  tab: AuthTab;
  reason?: string;
}

const CLOSED_DIALOG: DialogState = { open: false, tab: AUTH_TABS.login };
const ME_STALE_TIME_MS = 5 * 60_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { showMessage } = useSnackbar();
  const [token, setToken] = useState<string | null>(() => tokenStorage.get());
  const [dialog, setDialog] = useState<DialogState>(CLOSED_DIALOG);
  const [dialogMounted, setDialogMounted] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const meQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: ({ signal }) => authApi.getMe(signal),
    enabled: Boolean(token),
    staleTime: ME_STALE_TIME_MS,
  });

  const resetPersonalState = useCallback(() => {
    queryClient.removeQueries({ queryKey: queryKeys.me });
    void queryClient.invalidateQueries({ queryKey: queryKeys.engagement.likesAll });
  }, [queryClient]);

  useEffect(
    () =>
      subscribeUnauthorized(() => {
        setToken(null);
        resetPersonalState();
        showMessage('登入已逾時，請重新登入', 'warning');
      }),
    [resetPersonalState, showMessage],
  );

  const signIn = useCallback(
    (result: AuthResult) => {
      tokenStorage.set(result.accessToken);
      setToken(result.accessToken);
      queryClient.setQueryData(queryKeys.me, result.user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.engagement.likesAll });
    },
    [queryClient],
  );

  const signOut = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    resetPersonalState();
    showMessage('已登出', 'info');
  }, [resetPersonalState, showMessage]);

  const openAuthDialog = useCallback((options: OpenAuthDialogOptions = {}) => {
    pendingActionRef.current = options.onSuccess ?? null;
    setDialogMounted(true);
    setDialog({ open: true, tab: options.tab ?? AUTH_TABS.login, reason: options.reason });
  }, []);

  const closeAuthDialog = useCallback(() => {
    pendingActionRef.current = null;
    setDialog((previous) => ({ ...previous, open: false }));
  }, []);

  const handleAuthenticated = useCallback(
    (result: AuthResult) => {
      signIn(result);
      const pendingAction = pendingActionRef.current;
      pendingActionRef.current = null;
      setDialog((previous) => ({ ...previous, open: false }));
      showMessage(`歡迎回來，${result.user.displayName || result.user.name || '會員'}！`);
      pendingAction?.();
    },
    [showMessage, signIn],
  );

  const isAuthenticated = Boolean(token);

  const requireAuth = useCallback(
    (action: () => void, reason?: string) => {
      if (isAuthenticated) {
        action();
        return;
      }
      openAuthDialog({ reason, onSuccess: action });
    },
    [isAuthenticated, openAuthDialog],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: isAuthenticated ? (meQuery.data ?? null) : null,
      isAuthenticated,
      isLoadingUser: isAuthenticated && meQuery.isPending,
      signIn,
      signOut,
      openAuthDialog,
      closeAuthDialog,
      requireAuth,
    }),
    [closeAuthDialog, isAuthenticated, meQuery.data, meQuery.isPending, openAuthDialog, requireAuth, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {dialogMounted && (
        <Suspense fallback={null}>
          <AuthDialog open={dialog.open} initialTab={dialog.tab} reason={dialog.reason} onClose={closeAuthDialog} onAuthenticated={handleAuthenticated} />
        </Suspense>
      )}
    </AuthContext.Provider>
  );
}
