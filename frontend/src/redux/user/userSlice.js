import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
    sessionExpiry: null, 
    signupSuccess: false, 
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        
        // Sign In Actions
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        signInSuccess: (state, action) => {
            state.currentUser = action.payload; 
            state.loading = false;
            state.error = null;
            state.sessionExpiry = Date.now() + 60 * 60 * 1000;
        },

        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Sign Up Actions
        signUpStart: (state) => {
            state.loading = true;
            state.error = null;
            state.signupSuccess = false;
        },

        signUpSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.signupSuccess = true;
        },

        signUpFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.signupSuccess = false;
        },

        signoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
            state.sessionExpiry = null;
            state.signupSuccess = false;
        },
    }
});

export const { signInFailure, signInStart, signInSuccess, signUpStart, signUpSuccess, signUpFailure, signoutSuccess} = userSlice.actions;

export default userSlice.reducer;