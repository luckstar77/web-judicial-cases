import React, { useState, useRef, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useDispatch, useSelector } from 'react-redux';
import { setShowDialog } from '../redux/phoneSlice';

import { auth } from '../lib/firebase';
import {
    ConfirmationResult,
} from 'firebase/auth';
import { USER_DIALOG_STATUS } from '../types/enums';

export function UserDataDialog() {
    const [nameInComponent, setNameInComponent] = useState('');
    const [emailInComponent, setEmailInComponent] = useState('');


    const { phone, name, email, showDialog } = useSelector(
        (state: any) => state.user
    );

    useEffect(() => {
        if (name) {
            setNameInComponent(name);
        }
    }, [name]);

    useEffect(() => {
        if (email) {
            setEmailInComponent(email);
        }
    }, [email]);

    const dispatch = useDispatch();

    const handleSendCode = async () => {
    };
    
    const handleClose = async () => {
        dispatch(setShowDialog(USER_DIALOG_STATUS.NONE));
    };

    const handleConfirmCode = async () => {
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
                        required
                        id="outlined-required"
                        label="姓名"
                        defaultValue={nameInComponent}
                        onChange={(e) => setNameInComponent(e.target.value)}
                    />
                    <TextField
                        sx={{
                            margin: '10px 0px',
                            color: 'gray',
                        }}
                        fullWidth
                        required
                        id="outlined-required"
                        label="Email"
                        defaultValue={emailInComponent}
                        onChange={(e) => setEmailInComponent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    {/* TODO: implement function */}
                    {/* <Button onClick={handleConfirmCode}>確定</Button>
                    <Button onClick={handleConfirmCode}>登出</Button> */}
                </DialogActions>
            </Dialog>
        </div>
    );
}
