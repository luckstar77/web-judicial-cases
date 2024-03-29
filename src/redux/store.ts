import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import searchReducer from './searchSlice';
import phoneReducer from './phoneSlice';

export const store = configureStore({
    reducer: {
        data: dataReducer,
        search: searchReducer,
        user: phoneReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
