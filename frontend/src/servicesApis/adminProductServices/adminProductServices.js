import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000",
        credentials: "include"
    }),
    tagTypes: ["Product"],
    endpoints: (builder) => ({

        addProduct: builder.mutation({
            query: (formData) => ({
                url: "/add-product",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Product"]
        }),
        updateProduct: builder.mutation({
            query: ({ id, formData,...data }) => ({
                url: `/update-product/${id}`,
                method: "PUT",
                body: formData || data
            }),
            invalidatesTags: ["Product"]
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/delete-product/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Product"]
        }),
        filterProducts: builder.query({
            query: ({category,search,sort}) => ({
                url: "/filter-products",
                method: "GET",
                params:{
                    category,
                    search,
                    sort
                }

            }),
            providesTags: ["Product"]
        }),
         getAllAdminProducts: builder.query({
            query: () => "/getAdminProducts",
            providesTags: ["Product"]
        }),

        getAllProducts: builder.query({
            query: () => "/get-products",
            providesTags: ["Product"]
        }),
        getProduct: builder.query({
            query: (id) => `/get-Product/${id}`,
            providesTags: ["Product"]
        })


    })
})

export const { useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation, useGetAllProductsQuery, useGetProductQuery ,useFilterProductsQuery,useGetAllAdminProductsQuery} = productApi;