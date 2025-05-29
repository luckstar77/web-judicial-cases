import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './';              // store 型別

const API_URL = process.env.REACT_APP_API_URL;
const COMMENT_API_URL = `${API_URL}/comment`;

export interface Comment {
  id: number;
  userId: string;
  filesetId: number;
  content: string;
  createdAt: string;
  name?: string;
  email?: string;
  ip?: string;
}

interface CommentState {
  items: Record<number, Comment[]>;  // key = filesetId
  loading: boolean;
  error?: string | null;
}

const initialState: CommentState = {
    items: {},
    loading: false,
};

// --- async thunks -------------------------------------------------
export const fetchComments = createAsyncThunk<
  Comment[],
  number,
  { rejectValue: string }
>('comments/fetch', async (filesetId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            // Set the Authorization header with the token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.get<Comment[]>(`${COMMENT_API_URL}/${filesetId}`, config);
            return data;
        }
        return [];
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const addComment = createAsyncThunk<
  Comment | any,
  { filesetId: number; content: string },
  { rejectValue: string; state: RootState }
>('comments/add', async ({ filesetId, content }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            // Set the Authorization header with the token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post<Comment>(COMMENT_API_URL, {
                filesetId: filesetId,
                content,
            }, config);
            
            return data;

        }
        return;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

// --- slice --------------------------------------------------------
const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        clearComments(state, action: PayloadAction<number>) {
            delete state.items[action.payload];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, { payload }) => {
                state.loading = false;
                if (payload.length) {
                    state.items[payload[0].filesetId] = payload;
                }
            })
            .addCase(fetchComments.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload ?? 'error';
            })
            .addCase(addComment.fulfilled, (state, { payload }) => {
                const list = state.items[payload.filesetId] ?? [];
                state.items[payload.filesetId] = [payload, ...list];
            });
    },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;

// selector
export const selectCommentsByFileset = (id: number) => (state: RootState) =>
    state.comments.items[id] ?? [];
