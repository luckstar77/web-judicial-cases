export interface UserRecord {
  uid: string;
  phone: string;
  name?: string;
  displayName?: string;
  email?: string;
  password?: string;
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

export const createUserFixtures = (): UserRecord[] => [{ ...DEMO_USER }];
