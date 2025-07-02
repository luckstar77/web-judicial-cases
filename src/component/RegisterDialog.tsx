import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, verifyPhoneNumber, setShowDialog } from '../redux/phoneSlice';
import { USER_DIALOG_STATUS, FETCH_STATUS } from '../types/enums';
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

export function RegisterDialog() {
    const dispatch = useDispatch();
    const { showDialog, fetchStatus, error } = useSelector((state: any) => state.user);
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const recaptchaContainer = useRef(null);
    const recaptchaVerifier = useRef<RecaptchaVerifier>();

    useEffect(() => {
        if (recaptchaContainer.current) {
            recaptchaVerifier.current = new RecaptchaVerifier(
                recaptchaContainer.current,
                { size: 'invisible' },
                auth
            );
        }

        return () => {
            if (recaptchaVerifier.current) {
                recaptchaVerifier.current.clear();
            }
        };
    }, []);

    const handleClose = () => {
        dispatch(setShowDialog(USER_DIALOG_STATUS.NONE));
    };

    const handleSendCode = async () => {
        if (!recaptchaVerifier.current && recaptchaContainer.current) {
            recaptchaVerifier.current = new RecaptchaVerifier(
                recaptchaContainer.current,
                { size: 'invisible' },
                auth
            );
        }

        if (!recaptchaVerifier.current) {
            throw new Error('Unable to initialize recaptcha verifier.');
        }

        const result = await signInWithPhoneNumber(
            auth,
            '+886' + phone,
            recaptchaVerifier.current
        );
        setConfirmationResult(result);
    };

    const handleSubmit = async () => {
        if (confirmationResult) {
            try {
                const result: any = await confirmationResult.confirm(code);
                const firebaseToken = result.user.accessToken;
                await dispatch(
                    registerUser({
                        token: firebaseToken,
                        password,
                        name,
                        displayName: name,
                        email,
                        phone,
                    })
                ).unwrap();

                await dispatch(
                    verifyPhoneNumber({
                        token: firebaseToken,
                    })
                ).unwrap();

                handleClose();
            } catch (error) {
                console.error(error);
                // Do not close on failure so user can see the error
            }
        }
    };

    return (
        <Dialog open={showDialog === USER_DIALOG_STATUS.REGISTER} onClose={handleClose}>
            <DialogTitle>註冊</DialogTitle>
            <DialogContent>
                <TextField fullWidth margin="dense" label="電話" onChange={(e) => setPhone(e.target.value)} />
                <TextField fullWidth margin="dense" label="密碼" type="password" onChange={(e) => setPassword(e.target.value)} />
                <TextField fullWidth margin="dense" label="姓名" onChange={(e) => setName(e.target.value)} />
                <TextField fullWidth margin="dense" label="Email" onChange={(e) => setEmail(e.target.value)} />
                <TextField
                    fullWidth
                    margin="dense"
                    label="驗證 Token"
                    onChange={(e) => setCode(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <Button onClick={handleSendCode}>取得驗證碼</Button>
                        ),
                    }}
                />
                <div id="recaptcha-container" ref={recaptchaContainer}></div>
                {fetchStatus === FETCH_STATUS.ERROR && (
                    <Typography color="error" sx={{ mt: 1 }}>
                        {error || '註冊失敗'}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleSubmit}>註冊</Button>
            </DialogActions>
        </Dialog>
    );
}
