import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import searchReducer from './searchSlice';
import phoneReducer from './phoneSlice';
import commentsReducer from './commentSlice';

export const store = configureStore({
    reducer: {
        data: dataReducer,
        search: searchReducer,
        user: phoneReducer,
        comments: commentsReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
