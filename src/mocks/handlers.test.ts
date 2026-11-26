import { beforeEach, describe, expect, it } from 'vitest';
import { authApi } from '@/features/auth/api';
import { API_CODES } from '@/shared/constants/api';
import { TOKEN_STORAGE_KEY } from '@/shared/constants/storage-keys';
import { createMockDb } from './db';
import { DEMO_USER } from './fixtures/users';
import { createHandlers, createMockAccessToken } from './handlers';
import { server } from './server';

describe('mock API (MSW handlers)', () => {
  beforeEach(() => {
    server.use(...createHandlers({ db: createMockDb() }));
    window.localStorage.setItem(TOKEN_STORAGE_KEY, createMockAccessToken(DEMO_USER.phone));
  });

  it('returns hasPassword in the profile', async () => {
    await expect(authApi.getMe()).resolves.toMatchObject({ uid: DEMO_USER.uid, hasPassword: true });
  });

  it('rejects a password change without the correct current password (40101)', async () => {
    await expect(authApi.updateMe({ password: 'brand-new-pass-1' })).rejects.toMatchObject({ code: API_CODES.invalidCredentials });
    await expect(authApi.updateMe({ password: 'brand-new-pass-1', currentPassword: 'wrong-pass' })).rejects.toMatchObject({
      code: API_CODES.invalidCredentials,
    });
  });

  it('does not apply other fields when the password change is rejected', async () => {
    await expect(authApi.updateMe({ displayName: '不該被改', password: 'brand-new-pass-1' })).rejects.toBeDefined();

    await expect(authApi.getMe()).resolves.toMatchObject({ displayName: DEMO_USER.displayName });
  });

  it('revokes previously issued tokens after a password change', async () => {
    const oldToken = window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? '';

    const result = await authApi.updateMe({ password: 'brand-new-pass-1', currentPassword: DEMO_USER.password });

    expect(result.accessToken).not.toBe(oldToken);
    window.localStorage.setItem(TOKEN_STORAGE_KEY, oldToken);
    await expect(authApi.getMe()).rejects.toMatchObject({ code: API_CODES.unauthorized, httpStatus: 401 });
    window.localStorage.setItem(TOKEN_STORAGE_KEY, result.accessToken);
    await expect(authApi.getMe()).resolves.toMatchObject({ uid: DEMO_USER.uid });
  });
});
