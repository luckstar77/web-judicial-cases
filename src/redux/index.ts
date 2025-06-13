import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import searchReducer from './searchSlice';
import phoneReducer from './phoneSlice';
import commentsReducer from './commentSlice';
import likesReducer from './likeSlice';
import caseCommentsReducer from './caseCommentSlice';
import caseLikesReducer from './caseLikeSlice';
import uploadReducer from './uploadSlice';
import caseReducer from './caseSlice';

export const store = configureStore({
    reducer: {
        data: dataReducer,
        search: searchReducer,
        user: phoneReducer,
        comments: commentsReducer,
        likes: likesReducer,
        caseComments: caseCommentsReducer,
        caseLikes: caseLikesReducer,
        upload: uploadReducer,
        cases: caseReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
