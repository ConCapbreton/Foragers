import { createSlice } from "@reduxjs/toolkit";
import { Rootstate } from "../../app/store";

const authSlice = createSlice({
    name: 'auth',
    initialState: {username: null, token: null},
    reducers: {
        setCredentials: (state, action) => {
            const {username, accessToken} = action.payload
            state.username = username
            state.token = accessToken
        },
        logOut: (state, _action) => {
            state.username = null
            state.token = null
        },
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: Rootstate) => state.auth.username
export const selectCurrentToken = (state: Rootstate) => state.auth.token

