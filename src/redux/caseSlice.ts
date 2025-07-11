import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { CaseData } from '../component/CaseCard';

const API_URL = process.env.REACT_APP_API_URL;
const CASE_API_URL = `${API_URL}/case`;

export const fetchCaseList = createAsyncThunk<
    CaseData[],
    { page: number; pageSize: number }
>('cases/fetchCaseList', async ({ page, pageSize }) => {
    const response = await axios.get(CASE_API_URL, {
        params: { page, pageSize },
    });
    return response.data as CaseData[];
});

export const fetchCasePages = createAsyncThunk<
    number,
    { pageSize: number }
>('cases/fetchCasePages', async ({ pageSize }) => {
    const { data } = await axios.get<number>(`${CASE_API_URL}/pages`, {
        params: { pageSize },
    });
    return data;
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
        totalPages: 0,
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
            .addCase(fetchCasePages.fulfilled, (state, action: PayloadAction<number>) => {
                state.totalPages = action.payload;
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
