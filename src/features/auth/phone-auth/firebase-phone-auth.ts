import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type Auth } from 'firebase/auth';
import { FIREBASE_CONFIG } from '@/shared/constants/env';
import { PhoneAuthError, type PhoneAuthService } from './phone-auth';

const INVISIBLE_RECAPTCHA = 'invisible';

const FIREBASE_ERROR_CODES = {
  invalidCode: 'auth/invalid-verification-code',
  codeExpired: 'auth/code-expired',
  tooManyRequests: 'auth/too-many-requests',
  invalidPhone: 'auth/invalid-phone-number',
} as const;

let verifier: RecaptchaVerifier | null = null;

const getFirebaseAuth = (): Auth => {
  const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);
  const auth = getAuth(app);
  auth.useDeviceLanguage();
  return auth;
};

const getErrorCode = (error: unknown): string | undefined =>
  typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: unknown }).code) : undefined;

const toPhoneAuthError = (error: unknown): PhoneAuthError => {
  const code = getErrorCode(error);
  if (code === FIREBASE_ERROR_CODES.invalidCode || code === FIREBASE_ERROR_CODES.codeExpired) {
    return new PhoneAuthError('invalid-code', '驗證碼錯誤或已過期，請重新輸入');
  }
  if (code === FIREBASE_ERROR_CODES.tooManyRequests) {
    return new PhoneAuthError('too-many-requests', '簡訊發送次數過多，請稍後再試');
  }
  if (code === FIREBASE_ERROR_CODES.invalidPhone) {
    return new PhoneAuthError('invalid-phone', '手機號碼格式不正確');
  }
  return new PhoneAuthError('unknown', '簡訊驗證失敗，請稍後再試');
};

const resetVerifier = () => {
  verifier?.clear();
  verifier = null;
};

/** Firebase 手機簡訊驗證（invisible reCAPTCHA）。 */
export const firebasePhoneAuthService: PhoneAuthService = {
  async requestCode(phoneE164, recaptchaContainerId) {
    const auth = getFirebaseAuth();
    resetVerifier();
    verifier = new RecaptchaVerifier(auth, recaptchaContainerId, { size: INVISIBLE_RECAPTCHA });
    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneE164, verifier);
      return {
        async confirm(code) {
          try {
            const credential = await confirmation.confirm(code.trim());
            return await credential.user.getIdToken();
          } catch (error) {
            throw toPhoneAuthError(error);
          }
        },
      };
    } catch (error) {
      resetVerifier();
      throw toPhoneAuthError(error);
    }
  },
  reset: resetVerifier,
};
