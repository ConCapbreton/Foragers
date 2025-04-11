import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { apiSlice } from "./api/apiSlice"
import authReducer from '../features/auth/authSlice'


export const store = configureStore({
    reducer: {
        //dynamically named - whatever name is in the reducer path as the default path
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    // When using RTK Query with a store there is some required middleware
    // getDefaultMiddleware is the default provided by redux. 
    // An array is returned so we use concat to add the apiSlice.middleware
    // This managed cache lifetimes and expirations and is required when using RTK Query with an apiSlice
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
})

export type AppDispatch = typeof store.dispatch
export type Rootstate = ReturnType<typeof store.getState>
setupListeners(store.dispatch)