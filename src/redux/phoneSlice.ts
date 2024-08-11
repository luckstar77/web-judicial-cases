import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { FETCH_STATUS, USER_DIALOG_STATUS } from '../types/enums';

const API_URL = process.env.REACT_APP_API_URL;
const CASES_API_URL = `${API_URL}/verify`;
const USER_API_URL = `${API_URL}/user`;

// Create the async thunk for phone verification
export const verifyPhoneNumber: any = createAsyncThunk(
    'phone/verify',
    async (data, thunkAPI) => {
        try {
            const response = await axios.post(CASES_API_URL, data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return thunkAPI.rejectWithValue(axiosError.response?.data);
        }
    }
);

// Create the async thunk for phone verification
export const updateUserData: any = createAsyncThunk(
    'user/udateData',
    async (data, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Set the Authorization header with the token
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.post(USER_API_URL, data, config);
                return response.data;
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            return thunkAPI.rejectWithValue(axiosError.response?.data);
        }
    }
);

// Create the async thunk for getting user data
export const getUserData: any = createAsyncThunk(
    'user/getData',
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Set the Authorization header with the token
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(USER_API_URL, config);
                return response.data;
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            return thunkAPI.rejectWithValue(axiosError.response?.data);
        }
    }
);

// Create the slice
const phoneSlice = createSlice({
    name: 'user',
    initialState: {
        phone: '',
        ip: '',
        uid: '',
        token: '',
        fetchStatus: FETCH_STATUS.NONE,
        error: null,
        showData: false,
        showDialog: USER_DIALOG_STATUS.NONE,
        name: '',
        email: ''
    },
    reducers: {
        setTokenFromLocalStorage: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setShowDialog: (state, action: PayloadAction<USER_DIALOG_STATUS>) => {
            state.showDialog = action.payload;
        },
        setFetchStatus: (state, action: PayloadAction<FETCH_STATUS>) => {
            state.fetchStatus = action.payload;
        },
        logout: (state) => {
            state.phone = '';
            state.showDialog = USER_DIALOG_STATUS.NONE;
            localStorage.setItem('token', '');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyPhoneNumber.pending, (state) => {
                state.fetchStatus = FETCH_STATUS.LOADING;
            })
            .addCase(
                verifyPhoneNumber.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const { phone, ip, uid, token, name, email } = action.payload;
                    state.fetchStatus = FETCH_STATUS.SUCCESS;
                    state.phone = phone;
                    state.ip = ip;
                    state.uid = uid;
                    state.name = name;
                    state.email = email;
                    state.token = token;

                    // Store the token in localStorage
                    localStorage.setItem('token', token);
                }
            )
            .addCase(
                verifyPhoneNumber.rejected,
                (state, action: PayloadAction<any>) => {
                    state.fetchStatus = FETCH_STATUS.ERROR;
                    state.error = action.payload.message;
                }
            )
            // Handling the getUserData async thunk
            .addCase(getUserData.pending, (state) => {
                state.fetchStatus = FETCH_STATUS.LOADING;
            })
            .addCase(
                getUserData.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const { phone, ip, uid, name, email } = action.payload;
                    state.fetchStatus = FETCH_STATUS.SUCCESS;
                    state.phone = phone;
                    state.name = name;
                    state.email = email;
                    state.ip = ip;
                    state.uid = uid;
                }
            )
            .addCase(
                getUserData.rejected,
                (state, action: PayloadAction<any>) => {
                    state.fetchStatus = FETCH_STATUS.ERROR;
                    state.error = action.payload.message;
                }
            )
            // Handling the getUserData async thunk
            .addCase(updateUserData.pending, (state) => {
                state.fetchStatus = FETCH_STATUS.LOADING;
            })
            .addCase(
                updateUserData.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const { name, email, token } = action.payload;
                    state.fetchStatus = FETCH_STATUS.SUCCESS;
                    state.name = name;
                    state.email = email;
                    state.token = token;

                    // Store the token in localStorage
                    localStorage.setItem('token', token);
                }
            )
            .addCase(
                updateUserData.rejected,
                (state, action: PayloadAction<any>) => {
                    state.fetchStatus = FETCH_STATUS.ERROR;
                    state.error = action.payload.message;
                }
            );
    },
});
export const { setTokenFromLocalStorage, setShowDialog, setFetchStatus, logout } = phoneSlice.actions;

// Export the actions and reducer
export default phoneSlice.reducer;
