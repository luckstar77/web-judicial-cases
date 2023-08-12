import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TemporaryDrawer from '../component/TemporaryDrawer';
import { PhoneAuthDialog } from '../component/PhoneAuthDialog';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../redux/phoneSlice';
import { setTokenFromLocalStorage } from '../redux/phoneSlice';

export default function ButtonAppBar() {
    const dispatch = useDispatch(); // Hook to get the dispatch function

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Dispatch an action to set the token in your Redux state
            dispatch(setTokenFromLocalStorage(token));
        }
    }, [dispatch]);

    const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
    const { phone, ip, uid, token, loading, error } = useSelector(
        (state: any) => state.user
    );

    // When the component mounts, fetch the user data
    React.useEffect(() => {
        dispatch(getUserData());
    }, [dispatch]);

    const handleClickOpen = () => {
        setAuthDialogOpen(true);
    };

    const handleClose = () => {
        setAuthDialogOpen(false);
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
                    <Button color="inherit" onClick={handleClickOpen}>
                        {phone ? phone : '登入'}
                    </Button>
                    <PhoneAuthDialog
                        open={isAuthDialogOpen}
                        onClose={handleClose}
                    />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
