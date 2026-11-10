import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://bakery-bliss-backend.onrender.com",
        credentials: "include"
    }),
    endpoints: (builder) => ({

        signUp: builder.mutation({
            query: (data) => ({
                url: "/signUp",
                method: "POST",
                body: data
            })
        }),

        login: builder.mutation({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data
            })
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST"
            })
        }),

        googleLogin: builder.mutation({
            query: (data) => ({
                url: "/googleLogin",
                method: "POST",
                body: data
            })
        }),

        verifyOtp: builder.mutation({
            query: (data) => ({
                url: "/verify-otp",
                method: "POST",
                body: data
            })
        }),
         resendOtp: builder.mutation({
            query: (email) => ({
                url: "/resend-otp",
                method: "POST",
                body: {email}
            })
        })
      
      




    })
});

export const { useSignUpMutation, useLoginMutation, useLogoutMutation, useGoogleLoginMutation ,useVerifyOtpMutation,useResendOtpMutation} = authApi;
