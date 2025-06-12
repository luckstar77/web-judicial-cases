import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const UPLOAD_API_URL = `${API_URL}/cases`;

interface UploadState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
}

const initialState: UploadState = {
    status: 'idle',
};

export const uploadCase = createAsyncThunk<any, any, { rejectValue: string }>(
    'upload/uploadCase',
    async (data, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : undefined;
            const response = await axios.post(UPLOAD_API_URL, data, config);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        resetStatus(state) {
            state.status = 'idle';
            state.error = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadCase.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(uploadCase.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(uploadCase.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload || 'error';
            });
    },
});

export const { resetStatus } = uploadSlice.actions;
export default uploadSlice.reducer;
