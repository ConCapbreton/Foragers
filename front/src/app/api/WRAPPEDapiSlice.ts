import { createApi, fetchBaseQuery, BaseQueryApi } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../../features/auth/authSlice'
import { Rootstate } from '../store'

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_BASE_URI,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as Rootstate).auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args: any, api: BaseQueryApi, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions)
    // backend api sends 403 forbidden for an expired accessToken else a 401 for unauthorised
    if (result?.error?.status === 403) {
        console.log('sending refresh token')
        //send refresh token
        const refreshResult = await baseQuery('/refresh', api, extraOptions)
        console.log(refreshResult)
        if (refreshResult?.data) {
            const user = (api.getState() as Rootstate).auth.user
            //store the new token
            api.dispatch(setCredentials({...refreshResult, user}))
            //retry the original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut(undefined))
        }
    }
    return result
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    // tagTypes: ['Post', 'User'],
    endpoints: (_builder) => ({})
})