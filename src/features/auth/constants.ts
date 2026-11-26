export const AUTH_TABS = {
  login: 'login',
  register: 'register',
  sms: 'sms',
} as const;

export type AuthTab = (typeof AUTH_TABS)[keyof typeof AUTH_TABS];

export const AUTH_TAB_LABELS: Record<AuthTab, string> = {
  login: '登入',
  register: '註冊',
  sms: '簡訊登入',
};

export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 60;
export const RECAPTCHA_CONTAINER_ID = 'recaptcha-container';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;
export const NAME_MAX_LENGTH = 32;
export const DISPLAY_NAME_MAX_LENGTH = 30;

/** Mock 模式固定驗證碼（npm run dev:mock）。 */
export const MOCK_OTP_CODE = '123456';
export const MOCK_FIREBASE_TOKEN_PREFIX = 'mock-firebase-token:';
