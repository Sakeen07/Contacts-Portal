import { configureStore, createSlice } from "@reduxjs/toolkit"

// User authentication slice
const userSlice = createSlice({
    name: "user",
    initialState: { isLoggedIn: false, email: null },
    reducers: {
        login(state) {
            state.isLoggedIn = true;
            state.email = localStorage.getItem('userEmail') || null;
        }, 
        logout(state) {
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            localStorage.removeItem("userEmail");
            state.isLoggedIn = false;
            state.email = null;
        },
    }
})

export const userActions = userSlice.actions

export const store = configureStore({
    reducer: {
        user: userSlice.reducer
    }
})