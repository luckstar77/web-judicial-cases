import React, { useEffect, useState } from 'react';
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
import StockLogo from '../asset/rental_icon.png';
import CaseList from './CaseList';
import WarningNameList from './WarningNameList';
import { Button, ButtonGroup } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;
const CASES_API_URL = `${API_URL}/cases`;

const selected = {
    backgroundColor: 'primary.main',
};
const unselected = {
    backgroundColor: 'silver',
    color: 'black',
};

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
    const [cases, setCases]: [any, any] = React.useState([]);
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
        <Box
            sx={{
                position: 'relative',
                backgroundColor: 'whiite',
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
                            onClick={() => setActiveComponent('name')}
                            variant={'contained'}
                            sx={
                                activeComponent === 'name'
                                    ? selected
                                    : unselected
                            }
                        >
                            查姓名
                        </Button>
                        <Button
                            onClick={() => setActiveComponent('condition')}
                            variant={'contained'}
                            sx={
                                activeComponent === 'condition'
                                    ? selected
                                    : unselected
                            }
                        >
                            查條件
                        </Button>
                    </ButtonGroup>

                    {activeComponent === 'name' && (
                        <>
                            <Box sx={{ marginTop: '16px' }}>
                                <TextField
                                    onChange={handleSearchChange}
                                    label="請輸入房東或房客姓名"
                                    variant="outlined"
                                    sx={{ backgroundColor: 'white' }} // 白色背景
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
                                預警風險:
                                {cases.filter(
                                    (caseItem: any) =>
                                        (caseItem.plaintiff === searchCompare &&
                                            caseItem.win === 'defendant') ||
                                        (caseItem.defendant === searchCompare &&
                                            caseItem.win === 'plaintiff')
                                ).length === 0
                                    ? '無'
                                    : cases.filter(
                                        (caseItem: any) =>
                                            (caseItem.plaintiff ===
                                                  searchCompare &&
                                                  caseItem.win ===
                                                      'defendant') ||
                                              (caseItem.defendant ===
                                                  searchCompare &&
                                                  caseItem.win === 'plaintiff')
                                    ).length === 1
                                        ? '低'
                                        : cases.filter(
                                            (caseItem: any) =>
                                                (caseItem.plaintiff ===
                                                  searchCompare &&
                                                  caseItem.win ===
                                                      'defendant') ||
                                              (caseItem.defendant ===
                                                  searchCompare &&
                                                  caseItem.win === 'plaintiff')
                                        ).length === 2
                                            ? '中'
                                            : '高'}
                            </Typography>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                            >
                                預警案件數:
                                {
                                    cases.filter(
                                        (caseItem: any) =>
                                            (caseItem.plaintiff ===
                                                searchCompare &&
                                                caseItem.win === 'defendant') ||
                                            (caseItem.defendant ===
                                                searchCompare &&
                                                caseItem.win === 'plaintiff')
                                    ).length
                                }
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
        </Box>
    );
}

export default App;
