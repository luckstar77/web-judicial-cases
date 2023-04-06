import React, { useEffect, useState } from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import StockLogo from './rental_icon.png';
import CaseList from './component/CaseList';
import WarningNameList from './component/WarningNameList';
import { Button, ButtonGroup } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;
const CASES_API_URL = `${API_URL}/cases`;

const TABLE_WIN: Map = {
    plaintiff: '原告',
    defendant: '被告',
};

interface Map {
    [key: string]: any;
    [index: number]: any;
}

function App() {
    const [id, setId] = React.useState();
    const [plaintiff, setPlaintiff] = React.useState();
    const [defendant, setDefendant] = React.useState();
    const [rent, setRent] = React.useState();
    const [city, setCity] = React.useState('');
    const [jyear, setJyear] = React.useState('');
    const [win, setWin] = React.useState('');
    const [search, setSearch] = React.useState('');
    const [searchCompare, setSearchCompare] = React.useState('');
    const [cases, setCases] = React.useState([]);
    const [activeComponent, setActiveComponent] = useState<
        'name' | 'condition'
    >('name');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

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

    return (
        <div>
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
                style={{ minHeight: '100vh' }}
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
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography
                            variant="h4"
                            style={{
                                fontFamily:
                                    '"Noto Sans TC", "Roboto","Helvetica","Arial",sans-serif',
                                fontSize: '2.05rem',
                            }}
                            gutterBottom
                        >
                            租屋通
                        </Typography>
                    </Grid>
                    <Typography
                        variant="h6"
                        style={{
                            fontFamily:
                                '"Noto Sans TC", "Roboto","Helvetica","Arial",sans-serif',
                        }}
                        gutterBottom
                    >
                        輕鬆查詢房東房客預警資訊
                    </Typography>

                    <ButtonGroup fullWidth>
                        <Button
                            onClick={() => setActiveComponent('name')}
                            variant={
                                activeComponent === 'name'
                                    ? 'contained'
                                    : 'outlined'
                            }
                            color="primary"
                        >
                            查姓名
                        </Button>
                        <Button
                            onClick={() => setActiveComponent('condition')}
                            variant={
                                activeComponent === 'condition'
                                    ? 'contained'
                                    : 'outlined'
                            }
                            color="primary"
                        >
                            查條件
                        </Button>
                    </ButtonGroup>

                    {activeComponent === 'name' && (
                        <>
                            <Box style={{ marginTop: '16px' }}>
                                <TextField
                                    onChange={handleSearchChange}
                                    label="請輸入房東或房客姓名"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    type="button"
                                                    aria-label="search"
                                                    onClick={() => {
                                                        setSearchCompare(
                                                            search
                                                        );
                                                        axios
                                                            .get(
                                                                CASES_API_URL,
                                                                {
                                                                    params: {
                                                                        search,
                                                                    },
                                                                }
                                                            )
                                                            .then(
                                                                ({ data }) => {
                                                                    setCases(
                                                                        data
                                                                    );
                                                                }
                                                            )
                                                            .catch((error) => {
                                                                setOpen(true);
                                                                setErrorMessage(
                                                                    error
                                                                );
                                                            });
                                                    }}
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                            >
                                預警分數: {cases.length}
                            </Typography>
                            <CaseList
                                items={cases}
                                search={searchCompare}
                            ></CaseList>
                        </>
                    )}
                    {activeComponent === 'condition' && <WarningNameList />}
                </Box>
            </Grid>
        </div>
    );
}

export default App;
