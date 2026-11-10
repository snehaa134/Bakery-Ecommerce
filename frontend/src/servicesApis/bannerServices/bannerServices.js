import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bannerApi = createApi({
    reducerPath: "bannerApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://bakery-bliss-backend.onrender.com",
        credentials: "include"
    }),
    tagTypes: ["Banner"],
    endpoints: (builder) => ({

        addBanner: builder.mutation({
            query: (formData) => ({
                url: "/add-banner",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Banner"]
        }),
        updateBanner: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-banner/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Banner"]
        }),
        deleteBanner: builder.mutation({
            query: (id) => ({
                url: `/delete-banner/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Banner"]
        }),

        getAllBanners: builder.query({
            query: () => "/get-banners",
            providesTags: ["Banner"]
        }),
        getBanner: builder.query({
            query: (id) => `/get-banner/${id}`,
            providesTags: ["Banner"]
        })


    })
})

export const { useAddBannerMutation, useUpdateBannerMutation, useDeleteBannerMutation, useGetAllBannersQuery, useGetBannerQuery } = bannerApi;