import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const LIKES_API_URL = `${API_URL}/likes`;

interface LikeState {
  counts: Record<string, number>;
  liked: Record<string, boolean>;
  loading: Record<string, boolean>;
}

const initialState: LikeState = {
    counts: {},
    liked: {},
    loading: {}
};

// Thunks
export const fetchLikeStatus = createAsyncThunk<
  { filesetId: number; liked: boolean },
  number,
  { rejectValue: string }
>('likes/fetchStatus', async (filesetId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            // Set the Authorization header with the token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const resp = await axios.get<{ liked: boolean }>(`${LIKES_API_URL}/${filesetId}/status`, config);
            return { filesetId, liked: resp.data.liked };
        }
        throw new Error('no token');
    } catch (e: any) {
        return rejectWithValue(e.message);
    }
});

export const fetchLikeCount = createAsyncThunk(
    'likes/fetchCount',
    async (filesetId: number) => {
        const res = await axios.get(`${LIKES_API_URL}/${filesetId}`);
        return { filesetId, count: res.data.count };
    }
);

export const toggleLike = createAsyncThunk(
    'likes/toggle',
    async ({ filesetId }: { filesetId: number }) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Set the Authorization header with the token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const res = await axios.post(`${LIKES_API_URL}/${filesetId}`, {}, config);
            return { filesetId, liked: res.data.liked };
        }
        throw new Error('no token');
    }
);

const likeSlice = createSlice({
    name: 'likes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLikeCount.fulfilled, (state, action: PayloadAction<{ filesetId: number; count: number }>) => {
                const { filesetId, count } = action.payload;
                state.counts[filesetId] = count;
            })
            .addCase(toggleLike.pending, (state, action) => {
                const id = (action.meta.arg as any).filesetId;
                state.loading[id] = true;
            })
            .addCase(toggleLike.fulfilled, (state, action: PayloadAction<{ filesetId: number; liked: boolean }>) => {
                const { filesetId, liked } = action.payload;
                state.loading[filesetId] = false;
                state.liked[filesetId] = liked;
                state.counts[filesetId] = (state.counts[filesetId] || 0) + (liked ? 1 : -1);
            })
            .addCase(toggleLike.rejected, (state, action) => {
                const id = (action.meta.arg as any).filesetId;
                state.loading[id] = false;
            })
            .addCase(fetchLikeStatus.fulfilled, (state, action: PayloadAction<{ filesetId: number; liked: boolean }>) => {
                const { filesetId, liked } = action.payload;
                state.loading[filesetId] = false;
                state.liked[filesetId] = liked;
            });
    }
});

export default likeSlice.reducer;
