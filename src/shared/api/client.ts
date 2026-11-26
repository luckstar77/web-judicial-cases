import axios, { type AxiosRequestConfig } from 'axios';
import { API_CODES, HTTP_STATUS, REQUEST_TIMEOUT_MS } from '@/shared/constants/api';
import { API_BASE_URL } from '@/shared/constants/env';
import { ApiError, DEFAULT_ERROR_MESSAGE } from './api-error';
import { notifyUnauthorized } from './auth-events';
import { tokenStorage } from './token-storage';
import type { ApiEnvelope, ApiFailure, ApiSuccess } from './types';

const AUTHORIZATION_HEADER = 'Authorization';
const BEARER_PREFIX = 'Bearer ';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.set(AUTHORIZATION_HEADER, `${BEARER_PREFIX}${token}`);
  }
  return config;
});

const isEnvelope = (body: unknown): body is ApiEnvelope<unknown> =>
  typeof body === 'object' && body !== null && typeof (body as { code?: unknown }).code === 'number';

const isSuccess = (body: ApiEnvelope<unknown>): body is ApiSuccess<unknown> => body.code === API_CODES.success;

/** Token 無效：清除登入狀態並通知 AuthProvider（僅在原本有 token 時通知）。 */
const handleUnauthorized = (): void => {
  const hadToken = tokenStorage.get() !== null;
  tokenStorage.clear();
  if (hadToken) {
    notifyUnauthorized();
  }
};

const toFailureError = (body: ApiFailure, httpStatus?: number): ApiError => {
  if (body.code === API_CODES.unauthorized) {
    handleUnauthorized();
  }
  return new ApiError(body.code, body.error?.message || DEFAULT_ERROR_MESSAGE, httpStatus);
};

const statusToCode = (status: number): number => {
  if (status === HTTP_STATUS.unauthorized) {
    return API_CODES.unauthorized;
  }
  if (status === HTTP_STATUS.tooManyRequests) {
    return API_CODES.tooManyRequests;
  }
  return API_CODES.serverError;
};

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }
  if (!axios.isAxiosError(error)) {
    return new ApiError(API_CODES.serverError, DEFAULT_ERROR_MESSAGE);
  }
  const { response } = error;
  if (!response) {
    return new ApiError(API_CODES.network, error.message || DEFAULT_ERROR_MESSAGE);
  }
  if (response.status === HTTP_STATUS.unauthorized) {
    handleUnauthorized();
  }
  if (isEnvelope(response.data) && !isSuccess(response.data)) {
    return new ApiError(response.data.code, response.data.error?.message || DEFAULT_ERROR_MESSAGE, response.status);
  }
  return new ApiError(statusToCode(response.status), DEFAULT_ERROR_MESSAGE, response.status);
};

/** 解開 `{ status, code, data }`；`code !== 20000` 一律拋出 ApiError。 */
export const unwrapEnvelope = <T>(body: unknown, httpStatus?: number): T => {
  if (!isEnvelope(body)) {
    throw new ApiError(API_CODES.serverError, DEFAULT_ERROR_MESSAGE, httpStatus);
  }
  if (!isSuccess(body)) {
    throw toFailureError(body, httpStatus);
  }
  return body.data as T;
};

export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  let response;
  try {
    response = await apiClient.request<unknown>(config);
  } catch (error) {
    throw toApiError(error);
  }
  return unwrapEnvelope<T>(response.data, response.status);
};

type QueryParams = Record<string, string | number | undefined>;

export const apiGet = <T>(url: string, params?: QueryParams, signal?: AbortSignal): Promise<T> => apiRequest<T>({ method: 'GET', url, params, signal });

export const apiPost = <T>(url: string, data?: unknown): Promise<T> => apiRequest<T>({ method: 'POST', url, data });

export const apiPatch = <T>(url: string, data?: unknown): Promise<T> => apiRequest<T>({ method: 'PATCH', url, data });
