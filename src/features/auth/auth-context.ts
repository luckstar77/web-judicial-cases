import { createContext, useContext } from 'react';
import type { AuthResult, UserProfile } from '@/shared/api/types';
import type { AuthTab } from './constants';

export interface OpenAuthDialogOptions {
  tab?: AuthTab;
  /** 說明為何需要登入（例：「搜尋網友回報需要登入」）。 */
  reason?: string;
  /** 登入成功後要執行的動作。 */
  onSuccess?: () => void;
}

export interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  /** 有 token 但個人資料尚未載入完成。 */
  isLoadingUser: boolean;
  signIn: (result: AuthResult) => void;
  signOut: () => void;
  openAuthDialog: (options?: OpenAuthDialogOptions) => void;
  closeAuthDialog: () => void;
  /** 已登入就直接執行，否則開啟登入視窗並在登入後執行。 */
  requireAuth: (action: () => void, reason?: string) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
