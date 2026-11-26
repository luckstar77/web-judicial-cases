import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getErrorMessage } from '@/shared/api/api-error';
import type { AuthResult } from '@/shared/api/types';
import { authApi } from '../api';
import { AUTH_TABS, type AuthTab } from '../constants';
import { stripPhone } from '../phone';
import { loginSchema, type LoginFormValues } from '../schemas';
import { PasswordField } from './PasswordField';

interface LoginFormProps {
  onAuthenticated: (result: AuthResult) => void;
  onSwitchTab: (tab: AuthTab) => void;
}

export function LoginForm({ onAuthenticated, onSwitchTab }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { phone: '', password: '' } });

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login({ phone: stripPhone(values.phone), password: values.password }),
    onSuccess: onAuthenticated,
  });

  return (
    <Box component="form" noValidate onSubmit={handleSubmit((values) => mutation.mutate(values))}>
      <Stack spacing={2}>
        <TextField
          label="手機號碼"
          placeholder="0912345678"
          autoComplete="tel"
          {...register('phone')}
          error={Boolean(errors.phone)}
          helperText={errors.phone?.message}
          slotProps={{ htmlInput: { inputMode: 'tel' } }}
        />
        <PasswordField
          label="密碼"
          autoComplete="current-password"
          {...register('password')}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />
        {mutation.isError && <Alert severity="error">{getErrorMessage(mutation.error)}</Alert>}
        <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
          {mutation.isPending ? '登入中…' : '登入'}
        </Button>
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Button size="small" onClick={() => onSwitchTab(AUTH_TABS.sms)}>
            忘記密碼？用簡訊登入
          </Button>
          <Button size="small" onClick={() => onSwitchTab(AUTH_TABS.register)}>
            還沒有帳號？註冊
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
