import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const CASES_API_URL = `${API_URL}/cases`;

// 創建一個非同步 thunk action，該 action 將為我們的 slice 取得資料
export const fetchData: any = createAsyncThunk(
    'data/fetchData',
    async (params, thunkAPI) => {
        const response = await axios.get(CASES_API_URL, {
            params: params, // 这里我们将params传递给axios的get方法，axios会自动处理参数并将它们添加到URL后面
        }); // 替換為你的 API endpoint
        return response.data;
    }
);

// 創建我們的 data slice
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
                state.list = action.payload; // 在這裡假設 response.data 是陣列
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.status = 'failed';
                // state.error = action.error.message;
            });
    },
});

export const { setSearch, updateSearchCompare, updateSearchMode } =
    dataSlice.actions;

export default dataSlice.reducer;
