import { z } from 'zod';
import { DISPLAY_NAME_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/features/auth/constants';
import type { UpdateProfileRequest, UserProfile } from '@/shared/api/types';

export const profileSchema = z
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
  })
  .refine((values) => values.password === values.confirmPassword, { error: '兩次輸入的密碼不一致', path: ['confirmPassword'] });

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const toProfileFormValues = (user: UserProfile | null): ProfileFormValues => ({
  displayName: user?.displayName ?? '',
  email: user?.email ?? '',
  password: '',
  confirmPassword: '',
});

/** 只送出有變更的欄位。 */
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
  }
  return request;
};
