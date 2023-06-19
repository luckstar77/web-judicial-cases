import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import StockLogo from '../rental_icon.png';
import TemporaryDrawer from '../component/TemporaryDrawer';

export default function ButtonAppBar() {
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
                    <Button color="inherit">登入</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
