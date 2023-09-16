import React, { useState, useRef } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import SendIcon from '@mui/icons-material/Send';

import { useDispatch, useSelector } from 'react-redux';
import { verifyPhoneNumber } from '../redux/phoneSlice';

import { auth } from '../lib/firebase';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
} from 'firebase/auth';
import { AppDispatch } from '../redux/store';

export default function InputPhoneAuth() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [confirmationResult, setConfirmationResult] =
        useState<ConfirmationResult | null>(null);

    const recaptchaContainer = useRef(null);
    const recaptchaVerifier = React.useRef<RecaptchaVerifier | undefined>(
        undefined
    );

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
            phoneNumber,
            recaptchaVerifier.current
        );
        setConfirmationResult(result);
    };

    return (
        <Paper
            component="form"
            sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 400,
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="輸入電話號碼"
                inputProps={{ 'aria-label': '輸入電話號碼' }}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
                color="primary"
                sx={{ p: '10px' }}
                aria-label="send"
                onClick={handleSendCode}
            >
                <SendIcon />
            </IconButton>
            <div id="recaptcha-container" ref={recaptchaContainer}></div>
        </Paper>
    );
}
