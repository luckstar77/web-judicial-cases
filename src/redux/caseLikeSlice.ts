import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const CASE_API_URL = `${API_URL}/case`;

interface CaseLikeState {
    counts: Record<string, number>;
    liked: Record<string, boolean>;
    loading: Record<string, boolean>;
}

const initialState: CaseLikeState = {
    counts: {},
    liked: {},
    loading: {},
};

export const fetchCaseLikeStatus = createAsyncThunk<
    { caseId: number; liked: boolean },
    number,
    { rejectValue: string }
>("caseLikes/fetchStatus", async (caseId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const resp = await axios.get<{ liked: boolean }>(
                `${CASE_API_URL}/${caseId}`,
                config,
            );
            return { caseId, liked: resp.data.liked };
        }
        throw new Error("no token");
    } catch (e: any) {
        return rejectWithValue(e.message);
    }
});

export const fetchCaseLikeCount = createAsyncThunk(
    "caseLikes/fetchCount",
    async (caseId: number) => {
        const res = await axios.get(`${CASE_API_URL}/${caseId}`);
        return { caseId, count: res.data.likeCount };
    },
);

export const toggleCaseLike = createAsyncThunk(
    "caseLikes/toggle",
    async ({ caseId }: { caseId: number }) => {
        const token = localStorage.getItem("token");
        if (token) {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post(
                `${CASE_API_URL}/${caseId}/like`,
                {},
                config,
            );
            return { caseId, liked: res.data.liked };
        }
        throw new Error("no token");
    },
);

const caseLikeSlice = createSlice({
    name: "caseLikes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchCaseLikeCount.fulfilled,
                (
                    state,
                    action: PayloadAction<{ caseId: number; count: number }>,
                ) => {
                    const { caseId, count } = action.payload;
                    state.counts[caseId] = count;
                },
            )
            .addCase(toggleCaseLike.pending, (state, action) => {
                const id = (action.meta.arg as any).caseId;
                state.loading[id] = true;
            })
            .addCase(
                toggleCaseLike.fulfilled,
                (
                    state,
                    action: PayloadAction<{ caseId: number; liked: boolean }>,
                ) => {
                    const { caseId, liked } = action.payload;
                    state.loading[caseId] = false;
                    state.liked[caseId] = liked;
                    state.counts[caseId] =
                        (state.counts[caseId] || 0) + (liked ? 1 : -1);
                },
            )
            .addCase(toggleCaseLike.rejected, (state, action) => {
                const id = (action.meta.arg as any).caseId;
                state.loading[id] = false;
            })
            .addCase(
                fetchCaseLikeStatus.fulfilled,
                (
                    state,
                    action: PayloadAction<{ caseId: number; liked: boolean }>,
                ) => {
                    const { caseId, liked } = action.payload;
                    state.loading[caseId] = false;
                    state.liked[caseId] = liked;
                },
            );
    },
});

export default caseLikeSlice.reducer;
