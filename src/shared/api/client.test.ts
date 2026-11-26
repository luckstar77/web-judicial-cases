import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { server } from '@/mocks/server';
import { API_CODES } from '@/shared/constants/api';
import { API_BASE_URL } from '@/shared/constants/env';
import { TOKEN_STORAGE_KEY } from '@/shared/constants/storage-keys';
import { ApiError, getErrorMessage } from './api-error';
import { subscribeUnauthorized } from './auth-events';
import { apiGet, apiPost } from './client';

const TEST_PATH = '/__test__';
const TEST_URL = `${API_BASE_URL}${TEST_PATH}`;

describe('api client', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('unwraps data when code is 20000', async () => {
    server.use(http.get(TEST_URL, () => HttpResponse.json({ status: 'ok', code: API_CODES.success, data: { hello: '世界' } })));

    await expect(apiGet<{ hello: string }>(TEST_PATH)).resolves.toEqual({ hello: '世界' });
  });

  it('sends the stored token as a Bearer header', async () => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, 'jwt-token');
    let authorization: string | null = null;
    server.use(
      http.get(TEST_URL, ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json({ status: 'ok', code: API_CODES.success, data: null });
      }),
    );

    await apiGet(TEST_PATH);

    expect(authorization).toBe('Bearer jwt-token');
  });

  it('throws ApiError with code and message when code is not 20000', async () => {
    server.use(http.post(TEST_URL, () => HttpResponse.json({ status: 'error', code: API_CODES.validation, error: { message: 'title should not be empty' } })));

    const error = await apiPost(TEST_PATH, {}).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ code: API_CODES.validation, message: 'title should not be empty' });
    expect(getErrorMessage(error)).toBe('title should not be empty');
  });

  it('treats 20400 as a not-found ApiError', async () => {
    server.use(http.get(TEST_URL, () => HttpResponse.json({ status: 'error', code: API_CODES.notFound, error: { message: 'not found' } })));

    await expect(apiGet(TEST_PATH)).rejects.toMatchObject({ code: API_CODES.notFound });
  });

  it('clears the token and notifies listeners on HTTP 401', async () => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, 'expired-token');
    const listener = vi.fn();
    const unsubscribe = subscribeUnauthorized(listener);
    server.use(
      http.get(TEST_URL, () => HttpResponse.json({ status: 'error', code: API_CODES.unauthorized, error: { message: 'Unauthorized' } }, { status: 401 })),
    );

    await expect(apiGet(TEST_PATH)).rejects.toMatchObject({ code: API_CODES.unauthorized, httpStatus: 401 });

    expect(window.localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it('keeps a newer token when a request sent with a revoked token comes back 401', async () => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, 'old-token');
    const listener = vi.fn();
    const unsubscribe = subscribeUnauthorized(listener);
    server.use(
      http.get(TEST_URL, () => {
        // 請求送出後才換發新 token（例如同時間改密碼成功）
        window.localStorage.setItem(TOKEN_STORAGE_KEY, 'new-token');
        return HttpResponse.json({ status: 'error', code: API_CODES.unauthorized, error: { message: 'Unauthorized' } }, { status: 401 });
      }),
    );

    await expect(apiGet(TEST_PATH)).rejects.toMatchObject({ code: API_CODES.unauthorized });

    expect(window.localStorage.getItem(TOKEN_STORAGE_KEY)).toBe('new-token');
    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });

  it('clears the token when the envelope says 40100 even with HTTP 200', async () => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, 'expired-token');
    const listener = vi.fn();
    const unsubscribe = subscribeUnauthorized(listener);
    server.use(http.get(TEST_URL, () => HttpResponse.json({ status: 'error', code: API_CODES.unauthorized, error: { message: 'Unauthorized' } })));

    await expect(apiGet(TEST_PATH)).rejects.toMatchObject({ code: API_CODES.unauthorized });

    expect(window.localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it('does not notify listeners on 401 when the user was not logged in', async () => {
    const listener = vi.fn();
    const unsubscribe = subscribeUnauthorized(listener);
    server.use(http.get(TEST_URL, () => HttpResponse.json({ status: 'error', code: API_CODES.unauthorized }, { status: 401 })));

    await expect(apiGet(TEST_PATH)).rejects.toBeInstanceOf(ApiError);

    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });

  it('maps network failures to a network ApiError with a friendly message', async () => {
    server.use(http.get(TEST_URL, () => HttpResponse.error()));

    const error = await apiGet(TEST_PATH).catch((caught: unknown) => caught);

    expect(error).toMatchObject({ code: API_CODES.network });
    expect(getErrorMessage(error)).toBe('網路連線異常，請確認網路後再試');
  });

  it('maps HTTP 429 without envelope to tooManyRequests', async () => {
    server.use(http.get(TEST_URL, () => new HttpResponse('Too Many Requests', { status: 429 })));

    await expect(apiGet(TEST_PATH)).rejects.toMatchObject({ code: API_CODES.tooManyRequests });
  });
});
