import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, Paper, InputBase, Divider, IconButton,
    TextField, Typography, Stack
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPhoneNumber, setShowDialog } from '../redux/phoneSlice';
import { auth } from '../lib/firebase';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult
} from 'firebase/auth';
import { USER_DIALOG_STATUS } from '../types/enums';

const COUNTRY_CODE = '+886';

export function PhoneAuthDialog() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);

    const recaptchaContainer = useRef<HTMLDivElement>(null);
    const recaptchaVerifier = useRef<RecaptchaVerifier>();

    const { showDialog } = useSelector((state: any) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!recaptchaVerifier.current && recaptchaContainer.current) {
            recaptchaVerifier.current = new RecaptchaVerifier(
                recaptchaContainer.current,
                { size: 'invisible' },
                auth
            );
            // 调用 render() 会向该 div 注入 iframe
            recaptchaVerifier.current.render().catch(console.error);
        }
        return () => {
            // 卸载时清理，并移除所有子节点
            recaptchaVerifier.current?.clear();
            if (recaptchaContainer.current) {
                recaptchaContainer.current.innerHTML = '';
            }
        };
    }, []);

    const clearRecaptcha = () => {
        recaptchaVerifier.current?.clear();
        recaptchaVerifier.current = undefined;
        if (recaptchaContainer.current) {
            recaptchaContainer.current.innerHTML = '';
        }
    };

    const handleSendCode = async () => {
        setError(null);
        clearRecaptcha();

        // 重建 verifier
        if (recaptchaContainer.current) {
            recaptchaVerifier.current = new RecaptchaVerifier(
                recaptchaContainer.current,
                { size: 'invisible' },
                auth
            );
            await recaptchaVerifier.current.render();
        }

        try {
            const result = await signInWithPhoneNumber(
                auth,
                COUNTRY_CODE + phoneNumber,
      recaptchaVerifier.current!
            );
            setConfirmationResult(result);
        } catch (err: any) {
            console.error(err);
            // 这里处理 auth/invalid-app-credential 或 Timeout
            setError(err.message);
        }
    };

    const handleConfirmCode = async () => {
        if (!confirmationResult) return;
        try {
            const result: any = await confirmationResult.confirm(verificationCode);
            dispatch(verifyPhoneNumber({ token: result.user.accessToken }));
            dispatch(setShowDialog(USER_DIALOG_STATUS.NONE));
        } catch (err) {
            console.error(err);
            setError('驗證碼錯誤，請重新輸入');
        }
    };

    const handleClose = () => {
        dispatch(setShowDialog(USER_DIALOG_STATUS.NONE));
    };

    return (
        <Dialog open={showDialog === USER_DIALOG_STATUS.PHONE_AUTH} onClose={handleClose}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        電話登入
                <Typography flexGrow={1} />
                <IconButton size="small" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    <Paper
                        component="form"
                        sx={{ p: 1, display: 'flex', alignItems: 'center' }}
                        onSubmit={(e) => { e.preventDefault(); handleSendCode(); }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="請輸入電話號碼"
                            inputProps={{ 'aria-label': '電話號碼' }}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <IconButton
                            color="primary"
                            onClick={handleSendCode}
                            disabled={sending}
                        >
                            <SendIcon />
                        </IconButton>
                    </Paper>
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                    {confirmationResult && (
                        <TextField
                            label="輸入驗證碼"
                            variant="outlined"
                            fullWidth
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    )}
                </Stack>
                <div id="recaptcha-container" ref={recaptchaContainer} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                {confirmationResult && (
                    <Button onClick={handleConfirmCode} variant="contained">
            登入
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
