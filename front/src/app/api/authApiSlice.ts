//import { createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "./apiSlice";

// THIS IS FOR NORMALISING DATA FOR OPTIMIZATION (CONSIDER USING THIS FOR MUSHROOM SLICE)
// const postsAdapter = createEntityAdapter({
//     sortComparer: (a, b) => b.date.localeCompare(a.date)
// })

// const authAdapter = createEntityAdapter()
// const initialState = authAdapter.getInitialState(
//     token: null,
//     isAuthenticated: false,
// )

// DONE
// router.get('/check-auth', verifyToken, authCheck)
// router.post('/login', login)
// router.post('/verify-email', verifyEmail)
// router.post('/logout', logout)

//TO DO 

// router.post('/forgot-password', forgotPassword)
// router.post('/reset-password/:token', resetPassword)

// router.post('/signup', signup)



export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // checkAuth: builder.query<boolean, void>({
        //     query: () => '/api/auth/check-auth' 
        // }),
        loginUser: builder.mutation({
            query: (userDetails: {email: string, password: string, token: string}) => ({
                url: '/api/auth/login',
                method: 'POST',
                body: {...userDetails}
            }),
        }),
        verifyEmail: builder.mutation({
            query: (code: string) => ({
                url: '/api/auth/verify-email',
                method: 'POST',
                body: { code }
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: '/api/auth/logout',
                method: 'POST',
            }),
        }),
        forgotPassword: builder.mutation({
            query: () => ({
                url: '/api/auth/forgot-password',
                method: 'POST',
            }),
        }),
        resetPassword: builder.mutation({
            query: (resetDetails: {token: string, password: string}) => ({
                url: `/api/auth/forgot-password/${resetDetails.token}`,
                method: 'POST',
                body: {password: resetDetails.password}
            }),
        }),
    })
})

export const {
    // useCheckAuthQuery,
    useLoginUserMutation,
    useVerifyEmailMutation,
    useLogoutUserMutation,
    useForgotPasswordMutation,
} = extendedApiSlice