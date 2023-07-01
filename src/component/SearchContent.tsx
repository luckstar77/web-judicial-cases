import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import StockLogo from '../asset/rental_icon.png';
import WarningNameList from './WarningNameList';
import { Button, ButtonGroup } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import {
    fetchData,
    setSearch,
    updateSearchCompare,
    updateSearchMode,
} from '../redux/dataSlice';

const selected = {
    backgroundColor: 'primary.main',
};
const unselected = {
    backgroundColor: 'silver',
    color: 'black',
};

interface Map {
    [key: string]: any;
    [index: number]: any;
}

function App() {
    const [open, setOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const dispatch = useDispatch();
    const searchMode = useSelector((state: any) => state.data.searchMode);
    const search = useSelector((state: any) => state.data.search);

    return (
        <Box
            sx={{
                position: 'relative',
                backgroundColor: 'whiite',
                height: '390px',
            }}
        >
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    {errorMessage.toString()}
                </Alert>
            </Snackbar>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                // sx={{ minHeight: '100vh' }}
            >
                <Box minWidth={275}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <img src={StockLogo} style={{ width: '100px' }} />
                    </Grid>

                    <ButtonGroup fullWidth>
                        <Button
                            onClick={() => dispatch(updateSearchMode('name'))}
                            variant={'contained'}
                            sx={searchMode === 'name' ? selected : unselected}
                        >
                            查姓名
                        </Button>
                        <Button
                            onClick={() =>
                                dispatch(updateSearchMode('condition'))
                            }
                            variant={'contained'}
                            sx={
                                searchMode === 'condition'
                                    ? selected
                                    : unselected
                            }
                        >
                            查條件
                        </Button>
                    </ButtonGroup>

                    {searchMode === 'name' && (
                        <>
                            <Box sx={{ marginTop: '16px' }}>
                                <TextField
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        dispatch(setSearch(event.target.value))
                                    }
                                    value={search}
                                    label="請輸入房東或房客姓名"
                                    variant="outlined"
                                    sx={{ backgroundColor: 'white' }} // 白色背景
                                    fullWidth
                                    onKeyUp={(event) => {
                                        if (event.key === 'Enter') {
                                            dispatch(
                                                updateSearchCompare(search)
                                            );
                                            dispatch(fetchData({ search }));
                                            event.preventDefault();
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    type="button"
                                                    aria-label="search"
                                                    onClick={() => {
                                                        dispatch(
                                                            updateSearchCompare(
                                                                search
                                                            )
                                                        );
                                                        dispatch(
                                                            fetchData({
                                                                search,
                                                            })
                                                        );
                                                    }}
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </>
                    )}
                    {searchMode === 'condition' && <WarningNameList />}
                </Box>
            </Grid>
        </Box>
    );
}

export default App;
