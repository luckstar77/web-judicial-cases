import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { authApi } from '@/features/auth/api';
import { createMockDb } from '@/mocks/db';
import { DEMO_USER, SMS_ONLY_USER, type UserRecord } from '@/mocks/fixtures/users';
import { createHandlers, createMockAccessToken } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import { API_CODES } from '@/shared/constants/api';
import { ROUTES } from '@/shared/constants/routes';
import { TOKEN_STORAGE_KEY } from '@/shared/constants/storage-keys';
import { renderWithProviders } from '@/test/render';
import { ProfilePage } from './ProfilePage';

const NEW_PASSWORD = 'brand-new-pass-1';
const CURRENT_PASSWORD_LABEL = '目前密碼';

const storedToken = () => window.localStorage.getItem(TOKEN_STORAGE_KEY);

/** 以指定帳號登入並渲染個人資料頁，等暱稱載入後才開始操作（避免表單 reset 蓋掉輸入）。 */
const renderProfileAs = async (account: UserRecord) => {
  const token = createMockAccessToken(account.phone);
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  const user = userEvent.setup();
  renderWithProviders(<ProfilePage />, { route: ROUTES.profile });
  await waitFor(() => expect(screen.getByLabelText('暱稱')).toHaveValue(account.displayName));
  return { user, token };
};

const typeNewPassword = async (user: ReturnType<typeof userEvent.setup>, password: string = NEW_PASSWORD) => {
  await user.type(screen.getByLabelText('新密碼'), password);
  await user.type(screen.getByLabelText('確認新密碼'), password);
};

describe('ProfilePage — change password', () => {
  beforeEach(() => {
    // 每個測試使用全新的 mock DB，避免改密碼影響其他測試
    server.use(...createHandlers({ db: createMockDb() }));
  });

  it('asks for the current password only once a new password is being set', async () => {
    const { user } = await renderProfileAs(DEMO_USER);

    expect(screen.queryByLabelText(CURRENT_PASSWORD_LABEL)).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('新密碼'), 'a');

    expect(await screen.findByLabelText(CURRENT_PASSWORD_LABEL)).toBeInTheDocument();
  });

  it('requires the current password before submitting', async () => {
    const { user, token } = await renderProfileAs(DEMO_USER);

    await typeNewPassword(user);
    await user.click(screen.getByRole('button', { name: '儲存變更' }));

    expect(await screen.findByText('請輸入目前密碼')).toBeInTheDocument();
    expect(storedToken()).toBe(token);
  });

  it('shows a field error and keeps the session when the current password is wrong', async () => {
    const { user, token } = await renderProfileAs(DEMO_USER);

    await typeNewPassword(user);
    await user.type(await screen.findByLabelText(CURRENT_PASSWORD_LABEL), 'not-my-password');
    await user.click(screen.getByRole('button', { name: '儲存變更' }));

    expect(await screen.findByText('目前密碼不正確')).toBeInTheDocument();
    expect(screen.getByLabelText(CURRENT_PASSWORD_LABEL)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('手機號碼或密碼錯誤')).not.toBeInTheDocument();
    expect(storedToken()).toBe(token);
  });

  it('stores the re-issued token after a password change so the session survives token revocation', async () => {
    const { user, token: oldToken } = await renderProfileAs(DEMO_USER);

    await typeNewPassword(user);
    await user.type(await screen.findByLabelText(CURRENT_PASSWORD_LABEL), DEMO_USER.password ?? '');
    await user.click(screen.getByRole('button', { name: '儲存變更' }));

    expect(await screen.findByText('密碼已更新，其他裝置需重新登入')).toBeInTheDocument();
    const newToken = storedToken();
    expect(newToken).not.toBeNull();
    expect(newToken).not.toBe(oldToken);
    // 新 token 可以繼續使用；舊 token 已被撤銷
    await expect(authApi.getMe()).resolves.toMatchObject({ uid: DEMO_USER.uid, hasPassword: true });
    expect(storedToken()).toBe(newToken);
    expect(screen.getByLabelText('新密碼')).toHaveValue('');
    expect(screen.queryByText('請先登入')).not.toBeInTheDocument();
    window.localStorage.setItem(TOKEN_STORAGE_KEY, oldToken);
    await expect(authApi.getMe()).rejects.toMatchObject({ code: API_CODES.unauthorized, httpStatus: 401 });
  });

  it('lets an SMS-only account set a first password without the current password', async () => {
    const { user } = await renderProfileAs(SMS_ONLY_USER);

    await typeNewPassword(user);

    expect(screen.queryByLabelText(CURRENT_PASSWORD_LABEL)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '儲存變更' }));

    expect(await screen.findByText('密碼已更新，其他裝置需重新登入')).toBeInTheDocument();
    // 設定完第一組密碼後，下次變更就需要目前密碼
    await waitFor(() => expect(screen.getByLabelText('新密碼')).toHaveValue(''));
    await user.type(screen.getByLabelText('新密碼'), 'a');
    expect(await screen.findByLabelText(CURRENT_PASSWORD_LABEL)).toBeInTheDocument();
  });
});
