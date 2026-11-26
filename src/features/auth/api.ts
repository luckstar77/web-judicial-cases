import { apiGet, apiPatch, apiPost } from '@/shared/api/client';
import type { AuthResult, LoginRequest, RegisterRequest, UpdateProfileRequest, UserProfile, VerifyRequest } from '@/shared/api/types';
import { API_PATHS } from '@/shared/constants/api';

export const authApi = {
  verify: (body: VerifyRequest) => apiPost<AuthResult>(API_PATHS.authVerify, body),
  register: (body: RegisterRequest) => apiPost<AuthResult>(API_PATHS.authRegister, body),
  login: (body: LoginRequest) => apiPost<AuthResult>(API_PATHS.authLogin, body),
  getMe: (signal?: AbortSignal) => apiGet<UserProfile>(API_PATHS.usersMe, undefined, signal),
  updateMe: (body: UpdateProfileRequest) => apiPatch<AuthResult>(API_PATHS.usersMe, body),
};
