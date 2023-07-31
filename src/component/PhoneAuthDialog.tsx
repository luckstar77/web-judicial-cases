import React, { useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { useDispatch, useSelector } from 'react-redux';
import { verifyPhoneNumber } from '../redux/phoneSlice';

import { auth } from '../lib/firebase';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
} from 'firebase/auth';
import { AppDispatch } from '../redux/store';

interface PhoneAuthDialogProps {
    open: boolean;
    onClose: () => void;
}

export function PhoneAuthDialog({ open, onClose }: PhoneAuthDialogProps) {
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
                // onClose();
            } catch (error) {
                console.error(error);
                // Verification code was not valid, or something else went wrong
            }
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Phone Verification</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your phone number.
                    </DialogContentText>
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Button onClick={handleSendCode}>Send Code</Button>
                    <DialogContentText>
                        Please enter the verification code that was sent to your
                        mobile device.
                    </DialogContentText>
                    <input
                        type="text"
                        placeholder="Enter verification code"
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleConfirmCode}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <div id="recaptcha-container" ref={recaptchaContainer}></div>
        </div>
    );
}
