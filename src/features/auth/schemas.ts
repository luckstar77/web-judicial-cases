import { z } from 'zod';
import { DISPLAY_NAME_MAX_LENGTH, NAME_MAX_LENGTH, OTP_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from './constants';
import { isValidTaiwanMobile } from './phone';

export const phoneSchema = z
  .string()
  .trim()
  .min(1, { error: '請輸入手機號碼' })
  .refine(isValidTaiwanMobile, { error: '請輸入正確的手機號碼，例如 0912345678' });

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, { error: `密碼至少 ${PASSWORD_MIN_LENGTH} 個字元` })
  .max(PASSWORD_MAX_LENGTH, { error: `密碼最多 ${PASSWORD_MAX_LENGTH} 個字元` });

export const otpSchema = z
  .string()
  .trim()
  .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), { error: `請輸入 ${OTP_LENGTH} 位數驗證碼` });

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, { error: '請輸入密碼' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { error: '請輸入真實姓名' })
      .max(NAME_MAX_LENGTH, { error: `姓名最多 ${NAME_MAX_LENGTH} 個字` }),
    displayName: z
      .string()
      .trim()
      .min(1, { error: '請輸入暱稱' })
      .max(DISPLAY_NAME_MAX_LENGTH, { error: `暱稱最多 ${DISPLAY_NAME_MAX_LENGTH} 個字` }),
    email: z.email({ error: '請輸入正確的 Email' }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, { error: '兩次輸入的密碼不一致', path: ['confirmPassword'] });

export type RegisterProfileFormValues = z.infer<typeof registerProfileSchema>;
