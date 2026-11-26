import { zodResolver } from '@hookform/resolvers/zod';
import LogoutIcon from '@mui/icons-material/Logout';
import { Alert, Avatar, Box, Button, Divider, Paper, Skeleton, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BRAND_COLORS } from '@/app/theme';
import { authApi } from '@/features/auth/api';
import { useAuth } from '@/features/auth/auth-context';
import { PasswordField } from '@/features/auth/components/PasswordField';
import { formatPhoneForDisplay } from '@/features/auth/phone';
import { RequireAuth } from '@/features/auth/RequireAuth';
import { getErrorMessage } from '@/shared/api/api-error';
import { PageContainer } from '@/shared/components/PageContainer';
import { Seo } from '@/shared/components/Seo';
import { ROUTES } from '@/shared/constants/routes';
import { useSnackbar } from '@/shared/hooks/snackbar-context';
import { profileSchema, type ProfileFormValues, toProfileFormValues, toUpdateProfileRequest } from './profile-schema';

const NOT_SET = '未設定';

function ProfileSummary() {
  const { user, isLoadingUser, signOut } = useAuth();
  const navigate = useNavigate();
  const name = user?.displayName || user?.name || '會員';

  const handleSignOut = () => {
    signOut();
    navigate(ROUTES.home);
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px' }}>
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
        {isLoadingUser ? (
          <Skeleton variant="circular" width={72} height={72} />
        ) : (
          <Avatar sx={{ width: 72, height: 72, fontSize: '1.75rem', bgcolor: BRAND_COLORS.primaryLight, color: 'primary.main' }}>{name.slice(0, 1)}</Avatar>
        )}
        <Box>
          <Typography variant="h4" component="p">
            {isLoadingUser ? <Skeleton width={120} /> : name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.phone ? formatPhoneForDisplay(user.phone) : ' '}
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ my: 2.5 }} />
      <Stack spacing={1.25}>
        <Typography variant="body2" color="text.secondary">
          真實姓名：
          <Box component="span" sx={{ color: 'text.primary' }}>
            {user?.name || NOT_SET}
          </Box>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email：
          <Box component="span" sx={{ color: 'text.primary', overflowWrap: 'anywhere' }}>
            {user?.email || NOT_SET}
          </Box>
        </Typography>
      </Stack>
      <Button fullWidth variant="outlined" color="inherit" startIcon={<LogoutIcon />} onClick={handleSignOut} sx={{ mt: 3, borderColor: 'divider' }}>
        登出
      </Button>
    </Paper>
  );
}

function ProfileForm() {
  const { user, signIn } = useAuth();
  const { showMessage } = useSnackbar();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema), defaultValues: toProfileFormValues(user) });

  useEffect(() => {
    reset(toProfileFormValues(user));
  }, [reset, user]);

  const mutation = useMutation({
    mutationFn: (values: ProfileFormValues) => authApi.updateMe(toUpdateProfileRequest(values, user)),
    onSuccess: (result) => {
      signIn(result);
      showMessage('個人資料已更新');
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    if (Object.keys(toUpdateProfileRequest(values, user)).length === 0) {
      showMessage('資料沒有變更', 'info');
      return;
    }
    mutation.mutate(values);
  };

  return (
    <Paper variant="outlined" component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: '16px' }}>
      <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
        編輯個人資料
      </Typography>
      <Stack spacing={2.5}>
        <TextField
          label="暱稱"
          {...register('displayName')}
          error={Boolean(errors.displayName)}
          helperText={errors.displayName?.message ?? '發文與留言時顯示的名稱'}
        />
        <TextField label="Email" type="email" {...register('email')} error={Boolean(errors.email)} helperText={errors.email?.message} />
        <Divider textAlign="left">
          <Typography variant="caption" color="text.secondary">
            變更密碼（不修改請留空）
          </Typography>
        </Divider>
        <PasswordField
          label="新密碼"
          autoComplete="new-password"
          {...register('password')}
          error={Boolean(errors.password)}
          helperText={errors.password?.message ?? '8–64 個字元'}
        />
        <PasswordField
          label="確認新密碼"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
        />
        {mutation.isError && <Alert severity="error">{getErrorMessage(mutation.error)}</Alert>}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button color="inherit" disabled={!isDirty || mutation.isPending} onClick={() => reset(toProfileFormValues(user))}>
            取消
          </Button>
          <Button type="submit" variant="contained" disabled={!isDirty || mutation.isPending}>
            {mutation.isPending ? '儲存中…' : '儲存變更'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}

export function ProfilePage() {
  return (
    <PageContainer title="我的帳號" subtitle="管理你的暱稱、Email 與密碼" maxWidth="md">
      <Seo title="我的帳號" />
      <RequireAuth reason="登入後即可管理個人資料">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileSummary />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <ProfileForm />
          </Grid>
        </Grid>
      </RequireAuth>
    </PageContainer>
  );
}
