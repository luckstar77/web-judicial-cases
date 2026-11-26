import { MOCK_FIREBASE_TOKEN_PREFIX, MOCK_OTP_CODE } from '../constants';
import { PhoneAuthError, type PhoneAuthService } from './phone-auth';

const MOCK_DELAY_MS = 400;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockPhoneAuthService: PhoneAuthService = {
  async requestCode(phoneE164) {
    await wait(MOCK_DELAY_MS);
    return {
      async confirm(code) {
        await wait(MOCK_DELAY_MS);
        if (code.trim() !== MOCK_OTP_CODE) {
          throw new PhoneAuthError('invalid-code', '驗證碼錯誤，請重新輸入');
        }
        return `${MOCK_FIREBASE_TOKEN_PREFIX}${phoneE164}`;
      },
    };
  },
  reset() {
    // mock 無需清理
  },
};
