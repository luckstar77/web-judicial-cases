export interface UserRecord {
  uid: string;
  phone: string;
  name?: string;
  displayName?: string;
  email?: string;
  /** 未設定代表只用簡訊登入（`hasPassword: false`）。 */
  password?: string;
  /** 改密碼時遞增；版本較舊的 token 視為已撤銷（模擬後端 HTTP 401）。 */
  tokenVersion?: number;
}

/** 示範帳號：0912345678 / password123（mock 模式專用）。 */
export const DEMO_USER: UserRecord = {
  uid: 'mock-uid-demo',
  phone: '+886912345678',
  name: '王小租',
  displayName: '小租',
  email: 'demo@example.com',
  password: 'password123',
};

/** 只用簡訊登入、尚未設定密碼的帳號：0922333444（mock 模式以簡訊登入，驗證碼 123456）。 */
export const SMS_ONLY_USER: UserRecord = {
  uid: 'mock-uid-sms-only',
  phone: '+886922333444',
  displayName: '簡訊會員',
};

export const createUserFixtures = (): UserRecord[] => [{ ...DEMO_USER }, { ...SMS_ONLY_USER }];
