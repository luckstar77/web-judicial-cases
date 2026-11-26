import { zodResolver } from '@hookform/resolvers/zod';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Alert, Box, Button, Stack, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getErrorMessage, isApiErrorCode } from '@/shared/api/api-error';
import type { AuthResult } from '@/shared/api/types';
import { API_CODES } from '@/shared/constants/api';
import { authApi } from '../api';
import { AUTH_TABS, type AuthTab } from '../constants';
import { registerProfileSchema, type RegisterProfileFormValues } from '../schemas';
import { PasswordField } from './PasswordField';
import { PhoneOtpStep } from './PhoneOtpStep';

interface RegisterFormProps {
  onAuthenticated: (result: AuthResult) => void;
  onSwitchTab: (tab: AuthTab) => void;
}

const REGISTER_STEPS = ['手機驗證', '設定帳號'];
const PHONE_STEP = 0;
const PROFILE_STEP = 1;

export function RegisterForm({ onAuthenticated, onSwitchTab }: RegisterFormProps) {
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterProfileFormValues>({
    resolver: zodResolver(registerProfileSchema),
    defaultValues: { name: '', displayName: '', email: '', password: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: (values: RegisterProfileFormValues) => {
      if (!firebaseToken) {
        throw new Error('missing firebase token');
      }
      return authApi.register({
        firebaseToken,
        name: values.name,
        displayName: values.displayName,
        email: values.email,
        password: values.password,
      });
    },
    onSuccess: onAuthenticated,
    onError: (error) => {
      if (isApiErrorCode(error, API_CODES.invalidFirebaseToken)) {
        setFirebaseToken(null);
      }
    },
  });

  const activeStep = firebaseToken ? PROFILE_STEP : PHONE_STEP;
  const isConflict = isApiErrorCode(mutation.error, API_CODES.conflict);

  return (
    <Stack spacing={2.5}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {REGISTER_STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === PHONE_STEP ? (
        <>
          {mutation.isError && <Alert severity="error">{getErrorMessage(mutation.error)}</Alert>}
          <PhoneOtpStep confirmLabel="下一步" onVerified={(token) => setFirebaseToken(token)} />
        </>
      ) : (
        <Box component="form" noValidate onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <Stack spacing={2}>
            <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success">
              手機驗證完成，請設定帳號資料
            </Alert>
            <TextField
              label="真實姓名"
              autoComplete="name"
              {...register('name')}
              error={Boolean(errors.name)}
              helperText={errors.name?.message ?? '僅供平台驗證，不會公開'}
            />
            <TextField
              label="暱稱"
              autoComplete="nickname"
              {...register('displayName')}
              error={Boolean(errors.displayName)}
              helperText={errors.displayName?.message ?? '發文與留言時顯示的名稱'}
            />
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <PasswordField
              label="密碼"
              autoComplete="new-password"
              {...register('password')}
              error={Boolean(errors.password)}
              helperText={errors.password?.message ?? '8–64 個字元'}
            />
            <PasswordField
              label="確認密碼"
              autoComplete="new-password"
              {...register('confirmPassword')}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
            />
            {mutation.isError && (
              <Alert
                severity="error"
                action={
                  isConflict && (
                    <Button color="inherit" size="small" onClick={() => onSwitchTab(AUTH_TABS.login)}>
                      去登入
                    </Button>
                  )
                }
              >
                {getErrorMessage(mutation.error)}
              </Alert>
            )}
            <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
              {mutation.isPending ? '註冊中…' : '完成註冊'}
            </Button>
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
