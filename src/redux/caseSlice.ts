import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const CASE_API_URL = `${API_URL}/case`;

export const fetchCaseList: any = createAsyncThunk(
    'cases/fetchCaseList',
    async (params, thunkAPI) => {
        const response = await axios.get(CASE_API_URL, { params });
        return response.data;
    },
);

export const caseSlice = createSlice({
    name: 'cases',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCaseList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCaseList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchCaseList.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export default caseSlice.reducer;
