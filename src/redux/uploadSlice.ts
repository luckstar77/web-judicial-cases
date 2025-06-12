import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const UPLOAD_API_URL = `${API_URL}/case`;

interface UploadState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
}

const initialState: UploadState = {
    status: 'idle',
};

export interface UploadPayload {
    defendantName: string;
    defendantPhone: string;
    defendantIdNo: string;
    images: File[];
}

export const uploadCase = createAsyncThunk<
    any,
    UploadPayload,
    { rejectValue: string }
>('upload/uploadCase', async (data, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('defendantName', data.defendantName);
        formData.append('defendantPhone', data.defendantPhone);
        formData.append('defendantIdNo', data.defendantIdNo);
        data.images.forEach((f) => formData.append('images', f));

        const config = token
            ? {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'multipart/form-data',
                  },
              }
            : { headers: { 'Content-Type': 'multipart/form-data' } };

        const response = await axios.post(UPLOAD_API_URL, formData, config);
        return response.data;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

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
            .addCase(
                uploadCase.rejected,
                (state, action: PayloadAction<any>) => {
                    state.status = 'failed';
                    state.error = action.payload || 'error';
                },
            );
    },
});

export const { resetStatus } = uploadSlice.actions;
export default uploadSlice.reducer;
