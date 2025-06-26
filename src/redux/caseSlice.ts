import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { CaseData } from '../component/CaseCard';

const API_URL = process.env.REACT_APP_API_URL;
const CASE_API_URL = `${API_URL}/case`;

export const fetchCaseList = createAsyncThunk<
    CaseData[],
    Record<string, unknown> | void
>('cases/fetchCaseList', async (params) => {
    const response = await axios.get(CASE_API_URL, { params });
    return response.data as CaseData[];
});

export const searchCaseList = createAsyncThunk<
    CaseData[],
    string,
    { rejectValue: string }
>('cases/searchCaseList', async (query, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const url = `${CASE_API_URL}/search/${encodeURIComponent(query)}`;
        const resp = await axios.get(url, config);
        return resp.data as CaseData[];
    } catch (e: any) {
        return rejectWithValue(e.message);
    }
});

export const caseSlice = createSlice({
    name: 'cases',
    initialState: {
        list: [] as CaseData[],
        status: 'idle',
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCaseList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                fetchCaseList.fulfilled,
                (state, action: PayloadAction<CaseData[]>) => {
                    state.status = 'succeeded';
                    state.list = action.payload;
                },
            )
            .addCase(fetchCaseList.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(searchCaseList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                searchCaseList.fulfilled,
                (state, action: PayloadAction<CaseData[]>) => {
                    state.status = 'succeeded';
                    state.list = action.payload;
                },
            )
            .addCase(searchCaseList.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export default caseSlice.reducer;
