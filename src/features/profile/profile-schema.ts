import { z } from 'zod';
import { DISPLAY_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/features/auth/constants';
import type { UpdateProfileRequest, UserProfile } from '@/shared/api/types';

export const CURRENT_PASSWORD_REQUIRED_MESSAGE = '請輸入目前密碼';
export const CURRENT_PASSWORD_INCORRECT_MESSAGE = '目前密碼不正確';

interface ProfileSchemaOptions {
  /** 帳號已設定密碼（`hasPassword`）時，變更密碼必須輸入目前密碼。 */
  requireCurrentPassword: boolean;
}

export const createProfileSchema = ({ requireCurrentPassword }: ProfileSchemaOptions) =>
  z
    .object({
      displayName: z
        .string()
        .trim()
        .min(1, { error: '請輸入暱稱' })
        .max(DISPLAY_NAME_MAX_LENGTH, { error: `暱稱最多 ${DISPLAY_NAME_MAX_LENGTH} 個字` }),
      email: z.union([z.literal(''), z.email({ error: '請輸入正確的 Email' })]),
      password: z.union([
        z.literal(''),
        z
          .string()
          .min(PASSWORD_MIN_LENGTH, { error: `密碼至少 ${PASSWORD_MIN_LENGTH} 個字元` })
          .max(PASSWORD_MAX_LENGTH, { error: `密碼最多 ${PASSWORD_MAX_LENGTH} 個字元` }),
      ]),
      confirmPassword: z.string(),
      currentPassword: z.string(),
    })
    .refine((values) => values.password === values.confirmPassword, { error: '兩次輸入的密碼不一致', path: ['confirmPassword'] })
    .refine((values) => !requireCurrentPassword || !values.password || values.currentPassword.length > 0, {
      error: CURRENT_PASSWORD_REQUIRED_MESSAGE,
      path: ['currentPassword'],
    });

export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>;

export const toProfileFormValues = (user: UserProfile | null): ProfileFormValues => ({
  displayName: user?.displayName ?? '',
  email: user?.email ?? '',
  password: '',
  confirmPassword: '',
  currentPassword: '',
});

/** 只送出有變更的欄位；變更密碼且帳號已有密碼時一併送出目前密碼。 */
export const toUpdateProfileRequest = (values: ProfileFormValues, user: UserProfile | null): UpdateProfileRequest => {
  const request: UpdateProfileRequest = {};
  if (values.displayName !== (user?.displayName ?? '')) {
    request.displayName = values.displayName;
  }
  if (values.email && values.email !== (user?.email ?? '')) {
    request.email = values.email;
  }
  if (values.password) {
    request.password = values.password;
    if (user?.hasPassword) {
      request.currentPassword = values.currentPassword;
    }
  }
  return request;
};
