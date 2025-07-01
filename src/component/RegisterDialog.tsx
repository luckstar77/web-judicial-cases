import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setShowDialog } from '../redux/phoneSlice';
import { USER_DIALOG_STATUS } from '../types/enums';

export function RegisterDialog() {
    const dispatch = useDispatch();
    const { showDialog } = useSelector((state: any) => state.user);
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleClose = () => {
        dispatch(setShowDialog(USER_DIALOG_STATUS.NONE));
    };

    const handleSubmit = () => {
        dispatch(
            registerUser({
                token,
                password,
                name,
                displayName: name,
                email,
                phone,
            })
        );
    };

    return (
        <Dialog open={showDialog === USER_DIALOG_STATUS.REGISTER} onClose={handleClose}>
            <DialogTitle>註冊</DialogTitle>
            <DialogContent>
                <TextField fullWidth margin="dense" label="電話" onChange={(e) => setPhone(e.target.value)} />
                <TextField fullWidth margin="dense" label="密碼" type="password" onChange={(e) => setPassword(e.target.value)} />
                <TextField fullWidth margin="dense" label="姓名" onChange={(e) => setName(e.target.value)} />
                <TextField fullWidth margin="dense" label="Email" onChange={(e) => setEmail(e.target.value)} />
                <TextField fullWidth margin="dense" label="驗證 Token" onChange={(e) => setToken(e.target.value)} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleSubmit}>註冊</Button>
            </DialogActions>
        </Dialog>
    );
}
