import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

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
        loading: false,
        error: null,
        showLogin: false,
        showData: false,
    },
    reducers: {
        setTokenFromLocalStorage: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setShowLogin: (state, action: PayloadAction<boolean>) => {
            state.showLogin = action.payload;
        },
        // ... other reducers ...
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyPhoneNumber.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                verifyPhoneNumber.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const { phone, ip, uid, token } = action.payload;
                    state.loading = false;
                    state.phone = phone;
                    state.ip = ip;
                    state.uid = uid;
                    state.token = token;
                    state.showLogin = false;

                    // Store the token in localStorage
                    localStorage.setItem('token', token);
                }
            )
            .addCase(
                verifyPhoneNumber.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload.message;
                }
            )
            // Handling the getUserData async thunk
            .addCase(getUserData.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                getUserData.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const { phone, ip, uid } = action.payload;
                    state.loading = false;
                    state.phone = phone;
                    state.ip = ip;
                    state.uid = uid;
                }
            )
            .addCase(
                getUserData.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload.message;
                }
            );
    },
});
export const { setTokenFromLocalStorage, setShowLogin } = phoneSlice.actions;

// Export the actions and reducer
export default phoneSlice.reducer;
