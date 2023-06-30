import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ApiResponse = {
    name: string;
    count: number;
};

interface SearchState {
    city: string;
    rentRange: [number, number];
    score: number;
    results: ApiResponse[];
}

const initialState: SearchState = {
    city: '',
    rentRange: [0, 100000],
    score: 1,
    results: [],
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setCity: (state, action: PayloadAction<string>) => {
            state.city = action.payload;
        },
        setRentRange: (state, action: PayloadAction<[number, number]>) => {
            state.rentRange = action.payload;
        },
        setScore: (state, action: PayloadAction<number>) => {
            state.score = action.payload;
        },
        setResults: (state, action: PayloadAction<ApiResponse[]>) => {
            state.results = action.payload;
        },
    },
});

export const { setCity, setRentRange, setScore, setResults } =
    searchSlice.actions;

export default searchSlice.reducer;
