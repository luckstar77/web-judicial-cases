import { TOKEN_STORAGE_KEY } from '@/shared/constants/storage-keys';

/** localStorage 可能因隱私模式而拋錯，一律包 try/catch。 */
export const tokenStorage = {
  get(): string | null {
    try {
      const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
      return token ? token : null;
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      // 無法寫入時僅保留記憶體中的登入狀態
    }
  },
  clear(): void {
    try {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};
