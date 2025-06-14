import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import FacebookIcon from '@mui/icons-material/Facebook';
import HomeIcon from '@mui/icons-material/Home';
import QuizIcon from '@mui/icons-material/Quiz';
import InfoIcon from '@mui/icons-material/Info';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function TemporaryDrawer() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };

    const list = (anchor: Anchor) => (
        <Box
            sx={{
                width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
            }}
            role='presentation'
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {/* 🔹 首頁 */}
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/">
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary='首頁' />
                    </ListItemButton>
                </ListItem>

                {/* FAQ */}
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/faq">
                        <ListItemIcon>
                            <QuizIcon />
                        </ListItemIcon>
                        <ListItemText primary='FAQ' />
                    </ListItemButton>
                </ListItem>

                {/* 關於我們 */}
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/about">
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText primary="關於我們" />
                    </ListItemButton>
                </ListItem>
                {/* 討論區 */}
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/cases">
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="討論區" />
                    </ListItemButton>
                </ListItem>
                {/* 上傳案例 */}
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/upload">
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="上傳案例" />
                    </ListItemButton>
                </ListItem>
                <Link
                    href="https://www.facebook.com/profile.php?id=100093981245377"
                    target="_blank"
                >
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <FacebookIcon />
                            </ListItemIcon>
                            <ListItemText primary={'粉絲專頁'} />
                        </ListItemButton>
                    </ListItem>
                </Link>
            </List>
        </Box>
    );

    return (
        <div>
            {
                <>
                    <IconButton
                        size='large'
                        edge='start'
                        aria-label='menu'
                        sx={{ mr: 2, color: 'white' }}
                        onClick={toggleDrawer('left', true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer
                        anchor={'left'}
                        open={state['left']}
                        onClose={toggleDrawer('left', false)}
                    >
                        {list('left')}
                    </Drawer>
                </>
            }
        </div>
    );
}
