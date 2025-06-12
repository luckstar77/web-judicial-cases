import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const CASES_API_URL = `${API_URL}/cases`;
const CASE_API_URL = `${API_URL}/case`;

// 取得首頁案例列表 (/cases)
export const fetchCases: any = createAsyncThunk(
    'data/fetchCases',
    async (params, thunkAPI) => {
        const response = await axios.get(CASES_API_URL, { params });
        return response.data;
    }
);

// 取得討論區案例列表 (/case)
export const fetchData: any = createAsyncThunk(
    'data/fetchData',
    async (params, thunkAPI) => {
        const response = await axios.get(CASE_API_URL, { params });
        return response.data;
    }
);

export const dataSlice = createSlice({
    name: 'data',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
        searchCompare: '',
        searchMode: 'name',
        search: '',
    },
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        updateSearchCompare: (state, action) => {
            state.searchCompare = action.payload;
        },
        updateSearchMode: (state, action) => {
            state.searchMode = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchData.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchCases.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCases.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchCases.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { setSearch, updateSearchCompare, updateSearchMode } =
    dataSlice.actions;

export default dataSlice.reducer;
