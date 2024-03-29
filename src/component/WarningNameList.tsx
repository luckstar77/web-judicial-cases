import React, { useState } from 'react';
import {
    Container,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Typography,
    Slider,
} from '@mui/material';
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import {
    setCity,
    setRentRange,
    setScore,
    setResults,
} from '../redux/searchSlice';

const API_URL = process.env.REACT_APP_API_URL;
const NAME_API_URL = `${API_URL}/name`;

const App: React.FC = () => {
    const dispatch = useDispatch();
    const city = useSelector((state: any) => state.search.city);
    const rentRange = useSelector((state: any) => state.search.rentRange);
    const score = useSelector((state: any) => state.search.score);

    const handleSearch = async () => {
        const query = new URLSearchParams({
            city,
            rentMin: rentRange[0].toString(),
            rentMax: rentRange[1].toString(),
            score: score.toString(),
        });

        axios
            .get(NAME_API_URL, {
                params: query,
            })
            .then(({ data }) => {
                dispatch(setResults(data));
            })
            .catch((error: any) => {
                console.error(error);
            });
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                padding: '0px !important',
            }}
        >
            <FormControl
                fullWidth
                sx={{ marginTop: '16px', backgroundColor: 'white' }}
            >
                <InputLabel htmlFor="city-select">城市</InputLabel>
                <Select
                    value={city}
                    onChange={(e) =>
                        dispatch(setCity(e.target.value as string))
                    }
                    label="城市"
                    inputProps={{
                        name: 'city',
                        id: 'city-select',
                    }}
                >
                    <MenuItem value="臺北">臺北</MenuItem>
                    <MenuItem value="新北">新北</MenuItem>
                    <MenuItem value="桃園">桃園</MenuItem>
                    <MenuItem value="臺中">臺中</MenuItem>
                    <MenuItem value="臺南">臺南</MenuItem>
                    <MenuItem value="高雄">高雄</MenuItem>
                    <MenuItem value="宜蘭">宜蘭</MenuItem>
                    <MenuItem value="新竹">新竹</MenuItem>
                    <MenuItem value="苗栗">苗栗</MenuItem>
                    <MenuItem value="彰化">彰化</MenuItem>
                    <MenuItem value="南投">南投</MenuItem>
                    <MenuItem value="雲林">雲林</MenuItem>
                    <MenuItem value="嘉義">嘉義</MenuItem>
                    <MenuItem value="屏東">屏東</MenuItem>
                    <MenuItem value="澎湖">澎湖</MenuItem>
                    <MenuItem value="基隆">基隆</MenuItem>
                    <MenuItem value="花蓮">花蓮</MenuItem>
                    <MenuItem value="臺東">臺東</MenuItem>
                    <MenuItem value="金門">金門</MenuItem>
                    <MenuItem value="連江">連江</MenuItem>
                </Select>
            </FormControl>

            <Typography>租金範圍（1000 - 40,000）</Typography>
            <Slider
                value={rentRange}
                onChange={(_, newValue) =>
                    dispatch(setRentRange(newValue as [number, number]))
                }
                valueLabelDisplay="auto"
                min={1000}
                max={40000}
            />

            <FormControl fullWidth>
                <TextField
                    label="預警案件數"
                    type="number"
                    value={score}
                    onChange={(e) =>
                        dispatch(setScore(parseInt(e.target.value)))
                    }
                    inputProps={{
                        min: 1,
                    }}
                    sx={{ backgroundColor: 'white' }}
                />
            </FormControl>

            <Button
                onClick={handleSearch}
                variant="contained"
                color="primary"
                sx={{ marginTop: '16px' }}
            >
                搜尋
            </Button>
        </Container>
    );
};

export default App;
