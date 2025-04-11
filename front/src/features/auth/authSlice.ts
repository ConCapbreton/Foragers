import { createSlice } from "@reduxjs/toolkit";
import { Rootstate } from "../../app/store";

const authSlice = createSlice({
    name: 'auth',
    initialState: {user: null, token: null},
    reducers: {
        setCredentials: (state, action) => {
            const {user, accessToken} = action.payload
            state.user = user
            state.token = accessToken
        },
        logOut: (state, _action) => {
            state.user = null
            state.token = null
        },
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: Rootstate) => state.auth.user
export const selectCurrentToken = (state: Rootstate) => state.auth.token

