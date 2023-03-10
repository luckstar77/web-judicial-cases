import React, { useEffect } from 'react';
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
import StockLogo from './stock_icon.png';

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
    const [stocks, setStocks] = React.useState([]);

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
                                                axios
                                                    .get(CASES_API_URL, {
                                                        params: {
                                                            search,
                                                        },
                                                    })
                                                    .then(({ data }) => {
                                                        const {
                                                            id,
                                                            jyear,
                                                            plaintiff,
                                                            defendant,
                                                            rent,
                                                            city,
                                                            win,
                                                        } = data[0];
                                                        setId(id);
                                                        setPlaintiff(plaintiff);
                                                        setDefendant(defendant);
                                                        setWin(
                                                            win
                                                                ? TABLE_WIN[win]
                                                                : undefined
                                                        );
                                                        setRent(rent);
                                                        setCity(city);
                                                        setJyear(jyear);
                                                    })
                                                    .catch((error) => {
                                                        setOpen(true);
                                                        setErrorMessage(error);
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
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                                案件 ID: {id}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                原告: {plaintiff}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                被告: {defendant}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                年份: {jyear}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                勝訴方: {win}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                租金: {rent}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                地區: {city}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </div>
    );
}

export default App;
