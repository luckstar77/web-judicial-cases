import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './';

const API_URL = process.env.REACT_APP_API_URL;
const CASE_API_URL = `${API_URL}/case`;

export interface CaseComment {
  id: number;
  userId: string;
  filesetId?: number;
  caseId?: number;
  content: string;
  createdAt: string;
  name?: string;
  email?: string;
  ip?: string;
}

interface CaseCommentState {
  items: Record<number, CaseComment[]>;
  loading: boolean;
  error?: string | null;
}

const initialState: CaseCommentState = {
  items: {},
  loading: false,
};

export const fetchCaseComments = createAsyncThunk<
  CaseComment[],
  number,
  { rejectValue: string }
>('caseComments/fetch', async (caseId, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<CaseComment[]>(`${CASE_API_URL}/${caseId}/comments`);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const addCaseComment = createAsyncThunk<
  CaseComment | any,
  { caseId: number; content: string },
  { rejectValue: string }
>('caseComments/add', async ({ caseId, content }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.post<CaseComment>(
        `${CASE_API_URL}/${caseId}/comments`,
        { content },
        config
      );
      return data;
    }
    return;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const caseCommentSlice = createSlice({
  name: 'caseComments',
  initialState,
  reducers: {
    clearCaseComments(state, action: PayloadAction<number>) {
      delete state.items[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCaseComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCaseComments.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload.length) {
          const id = (payload[0].caseId ?? payload[0].filesetId) as number;
          state.items[id] = payload;
        }
      })
      .addCase(fetchCaseComments.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? 'error';
      })
      .addCase(addCaseComment.fulfilled, (state, { payload }) => {
        const id = (payload.caseId ?? payload.filesetId) as number;
        const list = state.items[id] ?? [];
        state.items[id] = [payload, ...list];
      });
  },
});

export const { clearCaseComments } = caseCommentSlice.actions;
export default caseCommentSlice.reducer;

export const selectCaseComments = (id: number) => (state: RootState) =>
  state.caseComments.items[id] ?? [];
export { fetchCaseComments, addCaseComment, selectCaseComments };
