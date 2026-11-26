import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { IS_API_MOCK } from '@/shared/constants/env';
import { MOCK_OTP_CODE, OTP_LENGTH, OTP_RESEND_SECONDS, RECAPTCHA_CONTAINER_ID } from '../constants';
import { formatPhoneForDisplay, toE164 } from '../phone';
import { loadPhoneAuthService, PhoneAuthError, type PhoneAuthService, type PhoneVerificationSession } from '../phone-auth/phone-auth';
import { otpSchema, phoneSchema } from '../schemas';

interface PhoneOtpStepProps {
  /** 驗證成功：回傳 Firebase ID token。 */
  onVerified: (firebaseToken: string) => Promise<void> | void;
  confirmLabel?: string;
  busy?: boolean;
}

const ONE_SECOND_MS = 1000;

const toMessage = (error: unknown): string => (error instanceof PhoneAuthError ? error.message : '簡訊驗證失敗，請稍後再試');

export function PhoneOtpStep({ onVerified, confirmLabel = '驗證', busy = false }: PhoneOtpStepProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [session, setSession] = useState<PhoneVerificationSession | null>(null);
  const serviceRef = useRef<PhoneAuthService | null>(null);

  useEffect(() => {
    if (countdown <= 0) {
      return undefined;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), ONE_SECOND_MS);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  useEffect(() => () => serviceRef.current?.reset(), []);

  const sendCode = async () => {
    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) {
      setPhoneError(parsed.error.issues[0]?.message ?? '手機號碼格式不正確');
      return;
    }
    setPhoneError(null);
    setFormError(null);
    setSending(true);
    try {
      serviceRef.current = serviceRef.current ?? (await loadPhoneAuthService());
      const nextSession = await serviceRef.current.requestCode(toE164(parsed.data), RECAPTCHA_CONTAINER_ID);
      setSession(nextSession);
      setCountdown(OTP_RESEND_SECONDS);
    } catch (error) {
      setFormError(toMessage(error));
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) {
      await sendCode();
      return;
    }
    const parsed = otpSchema.safeParse(code);
    if (!parsed.success) {
      setCodeError(parsed.error.issues[0]?.message ?? '驗證碼格式不正確');
      return;
    }
    setCodeError(null);
    setFormError(null);
    setConfirming(true);
    try {
      const firebaseToken = await session.confirm(parsed.data);
      await onVerified(firebaseToken);
    } catch (error) {
      setFormError(toMessage(error));
    } finally {
      setConfirming(false);
    }
  };

  const resendLabel = countdown > 0 ? `重新發送（${countdown}s）` : '重新發送';

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {IS_API_MOCK && <Alert severity="info">測試模式：可輸入任意手機號碼，驗證碼為 {MOCK_OTP_CODE}</Alert>}
        <TextField
          label="手機號碼"
          placeholder="0912345678"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          error={Boolean(phoneError)}
          helperText={phoneError ?? '我們會傳送 6 位數簡訊驗證碼到這支手機'}
          disabled={Boolean(session)}
          autoComplete="tel"
          slotProps={{ htmlInput: { inputMode: 'tel' } }}
        />
        {session && (
          <>
            <Typography variant="body2" color="text.secondary">
              驗證碼已傳送至 {formatPhoneForDisplay(toE164(phone))}
              <Button size="small" onClick={() => setSession(null)} sx={{ ml: 1 }}>
                修改號碼
              </Button>
            </Typography>
            <TextField
              label="簡訊驗證碼"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              error={Boolean(codeError)}
              helperText={codeError ?? ' '}
              autoComplete="one-time-code"
              autoFocus
              slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: OTP_LENGTH } }}
            />
          </>
        )}
        {formError && <Alert severity="error">{formError}</Alert>}
        {session ? (
          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" onClick={sendCode} disabled={countdown > 0 || sending} sx={{ flex: 1 }}>
              {resendLabel}
            </Button>
            <Button type="submit" variant="contained" disabled={confirming || busy} sx={{ flex: 1 }}>
              {confirming || busy ? '驗證中…' : confirmLabel}
            </Button>
          </Stack>
        ) : (
          <Button type="submit" variant="contained" size="large" startIcon={<SmsOutlinedIcon />} disabled={sending}>
            {sending ? '傳送中…' : '傳送驗證碼'}
          </Button>
        )}
        <div id={RECAPTCHA_CONTAINER_ID} />
      </Stack>
    </Box>
  );
}
