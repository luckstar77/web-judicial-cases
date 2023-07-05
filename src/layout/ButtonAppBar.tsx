import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import StockLogo from '../rental_icon.png';
import TemporaryDrawer from '../component/TemporaryDrawer';
import { PhoneAuthDialog } from '../component/PhoneAuthDialog';

export default function ButtonAppBar() {
    const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);

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
                        登入
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
