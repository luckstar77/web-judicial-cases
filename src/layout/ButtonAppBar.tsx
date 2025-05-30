import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TemporaryDrawer from '../component/TemporaryDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../redux/phoneSlice';
import { setTokenFromLocalStorage, setShowDialog } from '../redux/phoneSlice';
import { UserDialog } from '../component/UserDialog';
import { USER_DIALOG_STATUS } from '../types/enums';

export default function ButtonAppBar() {
    const dispatch = useDispatch(); // Hook to get the dispatch function

    // When the component mounts, fetch the user data
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Dispatch an action to set the token in your Redux state
            dispatch(setTokenFromLocalStorage(token));
            dispatch(getUserData());
        }
    }, [dispatch]);

    const { phone } = useSelector(
        (state: any) => state.user
    );

    const handleClickOpen = () => {
        if(phone) dispatch(setShowDialog(USER_DIALOG_STATUS.USER_DATA));
        else dispatch(setShowDialog(USER_DIALOG_STATUS.PHONE_AUTH));
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <TemporaryDrawer />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        {/* <img src={StockLogo} style={{ width: '50px' }} /> */}
                    </Typography>
                    <Button color="inherit" style={{fontSize:18}} onClick={handleClickOpen}>
                        {phone ? phone : '登入'}
                    </Button>
                    <UserDialog/>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
