import React, { useState, useRef, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';

import { useDispatch, useSelector } from 'react-redux';
import { verifyPhoneNumber, setShowDialog } from '../redux/phoneSlice';

import { auth } from '../lib/firebase';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
} from 'firebase/auth';
import { USER_DIALOG_STATUS } from '../types/enums';

const COUNTRY_CODE = '+886';

export function PhoneAuthDialog() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [confirmationResult, setConfirmationResult] =
        useState<ConfirmationResult | null>(null);

    const recaptchaContainer = useRef(null);
    const recaptchaVerifier = React.useRef<RecaptchaVerifier | undefined>(
        undefined
    );

    const { showDialog } = useSelector(
        (state: any) => state.user
    );

    useEffect(() => {
        // Initialize reCAPTCHA once when the component mounts
        if (recaptchaContainer.current) {
            recaptchaVerifier.current = new RecaptchaVerifier(
                recaptchaContainer.current,
                {
                    size: 'invisible',
                },
                auth
            );
        }

        // Clean up reCAPTCHA when the component unmounts
        return () => {
            if (recaptchaVerifier.current) {
                recaptchaVerifier.current.clear();
            }
        };
    }, []);

    const dispatch = useDispatch();

    const handleSendCode = async () => {
        // Create a new reCAPTCHA verifier if one does not exist
        if (!recaptchaVerifier.current && recaptchaContainer.current) {
            recaptchaVerifier.current = new RecaptchaVerifier(
                recaptchaContainer.current,
                {
                    size: 'invisible',
                },
                auth
            );
        }

        if (!recaptchaVerifier.current) {
            throw new Error('Unable to initialize recaptcha verifier.');
        }

        const result = await signInWithPhoneNumber(
            auth,
            COUNTRY_CODE + phoneNumber,
            recaptchaVerifier.current
        );
        setConfirmationResult(result);
    };
    
    const handleClose = async () => {
        dispatch(setShowDialog(USER_DIALOG_STATUS.NONE));
    };

    const handleConfirmCode = async () => {
        const code = verificationCode;

        // Confirm the phone number with the verification code
        if (confirmationResult !== null) {
            // Add null-check here
            try {
                const result: any = await confirmationResult.confirm(code);
                // Phone number has been verified successfully
                // Here you can add the user to your user list or perform any kind of post-verification action
                dispatch(
                    verifyPhoneNumber({
                        token: result.user.accessToken,
                    })
                );
                setConfirmationResult(null);
                handleClose();
            } catch (error) {
                console.error(error);
                // Verification code was not valid, or something else went wrong
            }
        }
    };

    return (
        <div>
            <Dialog open={showDialog === USER_DIALOG_STATUS.FORGOT_PASSWORD} onClose={handleClose}>
                <DialogTitle>忘記密碼</DialogTitle>
                <Typography variant="body1" sx={{ ml: 2, mt: 1 }}>
                    用手機接收簡訊驗證碼以重設密碼
                </Typography>
                <DialogContent>
                    <Paper
                        component="form"
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            width: { xs: '100%', sm: 400 },
                        }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1, fontSize: '1rem' }}
                            placeholder="請輸入你的電話號碼"
                            inputProps={{ 'aria-label': '請輸入你的電話號碼' }}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <Divider
                            sx={{ height: 28, m: 0.5 }}
                            orientation="vertical"
                        />
                        <IconButton
                            color="primary"
                            sx={{ p: '10px' }}
                            aria-label="send"
                            onClick={handleSendCode}
                        >
                            <SendIcon />
                        </IconButton>
                        <div
                            id="recaptcha-container"
                            ref={recaptchaContainer}
                        ></div>
                    </Paper>
                    <TextField
                        sx={{
                            margin: '10px 0px',
                            color: 'gray',
                        }}
                        fullWidth
                        id="standard-basic"
                        placeholder="請接收簡訊並輸入簡訊驗證碼"
                        variant="standard"
                        inputProps={{ style: { fontSize: '1rem' } }}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button sx={{ fontSize: '1rem' }} onClick={handleClose}>取消</Button>
                    <Button sx={{ fontSize: '1rem' }} onClick={handleConfirmCode}>確認</Button>
                </DialogActions>
            </Dialog>
            <div id="recaptcha-container" ref={recaptchaContainer}></div>
        </div>
    );
}
