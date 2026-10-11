import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000"
    }),
    tagTypes: ["Category"],
    endpoints: (builder) => ({

        addCategory: builder.mutation({
            query: (formData) => ({
                url: "/add-category",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Category"]
        }),
        updateCategory: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-category/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Category"]
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/delete-category/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Category"]
        }),

        getAllCategories: builder.query({
            query: () => "/get-categories",
            providesTags: ["Category"]
        }),
        getCategory: builder.query({
            query: (id) => `/get-category/${id}`,
            providesTags: ["Category"]
        })


    })
})

export const { useAddCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useGetAllCategoriesQuery, useGetCategoryQuery } = categoryApi;