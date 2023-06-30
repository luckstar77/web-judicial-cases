import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import searchReducer from './searchSlice';

export const store = configureStore({
    reducer: {
        data: dataReducer,
        search: searchReducer,
    },
});
