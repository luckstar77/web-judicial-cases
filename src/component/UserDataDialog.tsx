import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useDispatch, useSelector } from 'react-redux';
import { logout, setShowDialog, updateUserData } from '../redux/phoneSlice';
import { useNavigate, useLocation } from 'react-router-dom';

import { USER_DIALOG_STATUS } from '../types/enums';

export function UserDataDialog() {
    const [emailInComponent, setEmailInComponent] = useState('');
    const [displayNameInComponent, setDisplayNameInComponent] = useState('');
    const [passwordInComponent, setPasswordInComponent] = useState('********');


    const { phone, name, email, displayName, showDialog } = useSelector(
        (state: any) => state.user
    );

    useEffect(() => {
        if (email) {
            setEmailInComponent(email);
        }
    }, [email]);

    useEffect(() => {
        if (displayName) {
            setDisplayNameInComponent(displayName);
        }
    }, [displayName]);

    useEffect(() => {
        if (showDialog === USER_DIALOG_STATUS.USER_DATA) {
            setPasswordInComponent('********');
        }
    }, [showDialog]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleClose = async () => {
        dispatch(setShowDialog(USER_DIALOG_STATUS.NONE));
    };

    const handleConfirmData = async () => {
        const payload: any = {
            email: emailInComponent,
            displayName: displayNameInComponent,
        };
        if (passwordInComponent !== '********' && passwordInComponent !== '') {
            payload.password = passwordInComponent;
        }
        dispatch(updateUserData(payload));
    };

    const handleLogout = async () => {
        dispatch(logout());
        if (location.pathname === '/upload') {
            navigate('/cases');
        }
    };

    return (
        <div>
            <Dialog open={showDialog===USER_DIALOG_STATUS.USER_DATA} onClose={handleClose}>
                <DialogTitle>用戶資料</DialogTitle>
                <DialogContent>
                    <TextField
                        sx={{
                            margin: '10px 0px',
                            color: 'gray',
                        }}
                        fullWidth
                        disabled
                        id="outlined-disabled"
                        label="電話"
                        defaultValue={phone}
                    />
                    <TextField
                        sx={{
                            margin: '10px 0px',
                            color: 'gray',
                        }}
                        fullWidth
                        disabled
                        id="outlined-disabled-name"
                        label="姓名"
                        defaultValue={name}
                    />
                    <TextField
                        sx={{
                            margin: '10px 0px',
                            color: 'gray',
                        }}
                        fullWidth
                        id="outlined-display-name"
                        label="顯示名稱"
                        value={displayNameInComponent}
                        onChange={(e) => setDisplayNameInComponent(e.target.value)}
                    />
                    <TextField
                        sx={{
                            margin: '10px 0px',
                            color: 'gray',
                        }}
                        fullWidth
                        id="outlined-required"
                        label="Email"
                        value={emailInComponent}
                        onChange={(e) => setEmailInComponent(e.target.value)}
                    />
                    <TextField
                        sx={{
                            margin: '10px 0px',
                            color: 'gray',
                        }}
                        fullWidth
                        id="outlined-password"
                        label="密碼"
                        type="password"
                        value={passwordInComponent}
                        onFocus={() => {
                            if (passwordInComponent === '********') {
                                setPasswordInComponent('');
                            }
                        }}
                        onChange={(e) => setPasswordInComponent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    
                    <Button onClick={handleConfirmData}>確定</Button>
                    <Button onClick={handleLogout}>登出</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
