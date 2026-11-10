import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createApi } from "@reduxjs/toolkit/query/react";


export const adminAuthApi = createApi({
    reducerPath: "adminAuthApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://bakery-bliss-backend.onrender.com",
        credentials: "include"
    }),
    endpoints: (builder) => ({
        adminSignUp: builder.mutation({
            query: (data) => ({
                url: "/admin-SignUp",
                method: "POST",
                body: data
            })
        }),

        adminLogin: builder.mutation({
            query: (data) => ({
                url: "/admin-Login",
                method: "POST",
                body: data
            })
        }),

        adminLogout: builder.mutation({
            query: (data) => ({
                url: "/admin-Logout",
                method: "POST",
                body: data
            })
        }),

          adminGoogleLogin: builder.mutation({
            query: (data) => ({
                url: "/admin-googleLogin",
                method: "POST",
                body: data
            })
        })
    })
})
export const { useAdminSignUpMutation, useAdminLoginMutation ,useAdminLogoutMutation , useAdminGoogleLoginMutation} = adminAuthApi;
