import { Alert, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/shared/api/api-error';
import type { AuthResult } from '@/shared/api/types';
import { authApi } from '../api';
import { PhoneOtpStep } from './PhoneOtpStep';

interface SmsLoginFormProps {
  onAuthenticated: (result: AuthResult) => void;
}

export function SmsLoginForm({ onAuthenticated }: SmsLoginFormProps) {
  const mutation = useMutation({
    mutationFn: (firebaseToken: string) => authApi.verify({ firebaseToken }),
    onSuccess: onAuthenticated,
  });

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        忘記密碼也沒關係：以簡訊驗證碼登入後，可到「我的」頁面重新設定密碼。
      </Typography>
      <PhoneOtpStep confirmLabel="登入" busy={mutation.isPending} onVerified={(token) => mutation.mutate(token)} />
      {mutation.isError && <Alert severity="error">{getErrorMessage(mutation.error)}</Alert>}
    </Stack>
  );
}
