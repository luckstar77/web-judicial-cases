import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setShowDialog } from '../redux/phoneSlice';
import { USER_DIALOG_STATUS } from '../types/enums';

export function LoginDialog() {
    const dispatch = useDispatch();
    const { showDialog } = useSelector((state: any) => state.user);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleClose = () => {
        dispatch(setShowDialog(USER_DIALOG_STATUS.NONE));
    };

    const handleLogin = () => {
        dispatch(loginUser({ phone, password }));
    };

    const handleRegister = () => {
        dispatch(setShowDialog(USER_DIALOG_STATUS.REGISTER));
    };

    const handleForgot = () => {
        dispatch(setShowDialog(USER_DIALOG_STATUS.FORGOT_PASSWORD));
    };

    return (
        <Dialog open={showDialog === USER_DIALOG_STATUS.LOGIN} onClose={handleClose}>
            <DialogTitle>登入</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="dense"
                    label="電話"
                    onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="密碼"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleRegister}>註冊</Button>
                <Button onClick={handleForgot}>忘記密碼</Button>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleLogin}>登入</Button>
            </DialogActions>
        </Dialog>
    );
}
