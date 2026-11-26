import { IS_API_MOCK } from '@/shared/constants/env';

/** 已送出簡訊、等待輸入驗證碼的階段。 */
export interface PhoneVerificationSession {
  /** 驗證碼正確時回傳 Firebase ID token。 */
  confirm: (code: string) => Promise<string>;
}

export interface PhoneAuthService {
  requestCode: (phoneE164: string, recaptchaContainerId: string) => Promise<PhoneVerificationSession>;
  reset: () => void;
}

export class PhoneAuthError extends Error {
  readonly reason: 'invalid-code' | 'too-many-requests' | 'invalid-phone' | 'unknown';

  constructor(reason: PhoneAuthError['reason'], message: string) {
    super(message);
    this.name = 'PhoneAuthError';
    this.reason = reason;
  }
}

/** Mock 模式使用假的簡訊驗證（驗證碼 123456），其餘情況動態載入 Firebase。 */
export const loadPhoneAuthService = async (): Promise<PhoneAuthService> => {
  if (IS_API_MOCK) {
    const { mockPhoneAuthService } = await import('./mock-phone-auth');
    return mockPhoneAuthService;
  }
  const { firebasePhoneAuthService } = await import('./firebase-phone-auth');
  return firebasePhoneAuthService;
};
