import { API_CODES } from '@/shared/constants/api';

const DEFAULT_ERROR_MESSAGE = '系統忙碌中，請稍後再試';

const FRIENDLY_MESSAGES: Partial<Record<number, string>> = {
  [API_CODES.notFound]: '查無資料，可能已被刪除或網址有誤',
  [API_CODES.unauthorized]: '請先登入後再繼續',
  [API_CODES.invalidCredentials]: '手機號碼或密碼錯誤',
  [API_CODES.invalidFirebaseToken]: '簡訊驗證已失效，請重新取得驗證碼',
  [API_CODES.conflict]: '此手機號碼已註冊，請直接登入或使用簡訊登入',
  [API_CODES.tooManyRequests]: '操作太頻繁了，請稍候一分鐘再試',
  [API_CODES.serverError]: DEFAULT_ERROR_MESSAGE,
  [API_CODES.network]: '網路連線異常，請確認網路後再試',
};

/** 後端回傳 `code !== 20000` 或連線失敗時拋出的錯誤。 */
export class ApiError extends Error {
  readonly code: number;
  readonly httpStatus?: number;

  constructor(code: number, message: string, httpStatus?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

export const isApiErrorCode = (error: unknown, code: number): boolean => isApiError(error) && error.code === code;

/**
 * 給使用者看的錯誤訊息：驗證錯誤（40000）顯示後端訊息，其餘使用友善文案。
 */
export const getErrorMessage = (error: unknown, fallback: string = DEFAULT_ERROR_MESSAGE): string => {
  if (!isApiError(error)) {
    return fallback;
  }
  if (error.code === API_CODES.validation) {
    return error.message || fallback;
  }
  return FRIENDLY_MESSAGES[error.code] ?? (error.message || fallback);
};

export { DEFAULT_ERROR_MESSAGE };
