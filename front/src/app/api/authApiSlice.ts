import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

//import { setCredentials, logOut } from '../../features/auth/authSlice'
//import { Rootstate } from '../store'


export const authApiSlice = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_BASE_URI,
        credentials: 'include', 
    }),
    endpoints: (builder) => ({
        isAuth: builder.query({
            query: () => '/api/auth/authenticated'
        }),
        refresh: builder.query ({
            query: () => '/api/auth/refresh'
        }),
        signupUser: builder.mutation({
            query: (userDetails: {username: string, email: string, password: string, dob: string, termsAccepted: boolean, token: string}) => ({
                url: '/api/auth/signup',
                method: 'POST',
                body: {...userDetails}
            }),
        }),
        loginUser: builder.mutation({
            query: (userDetails: {email: string, password: string, token: string}) => ({
                url: '/api/auth/login',
                method: 'POST',
                body: {...userDetails}
            }),
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/api/auth/forgot-password',
                method: 'POST',
                body: {...email}
            }),
        }),
        resetPassword: builder.mutation({
            query: (resetDetails: {token: string, password: string}) => ({
                url: `/api/auth/reset-password/${resetDetails.token}`,
                method: 'POST',
                body: {password: resetDetails.password}
            }),
        }),
    }),
})

export const {
    useIsAuthQuery,
    useRefreshQuery,
    useSignupUserMutation,
    useLoginUserMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApiSlice