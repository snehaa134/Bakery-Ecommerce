
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include"
  }),

  tagTypes: ["User"],

  endpoints: (builder) => ({

    getCurrentUser: builder.query({
      query: () => ({
        url: "/current-user",
        method: "GET"
      }),
      providesTags: ["User"]
    }),

    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/update-profile",
        method: "PUT",
        body: formData
      }),
      invalidatesTags: ["User"]
    })

  })
});

export const {
  useGetCurrentUserQuery,
  useUpdateProfileMutation
} = userApi;
