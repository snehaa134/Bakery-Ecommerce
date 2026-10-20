import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000",
        credentials: "include"
    }),
    tagTypes: ["Cart"],
    endpoints: (builder) => ({
        addToCart: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: "/add-to-cart",
                method: "POST",
                body: {
                    productId,
                    quantity
                }
            }),
            invalidatesTags: ["Cart"]
        }),
        updateQuantity: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: "/update-quantity",
                method: "PATCH",
                body: {
                    productId,
                    quantity
                }
            }),
            invalidatesTags: ["Cart"]
        }),
        removeProduct: builder.mutation({
            query: (productId) => ({
                url: `/remove-product/${productId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Cart"]
        }),
        getCart: builder.query({
            query: () => "/get-cart",
            providesTags: ["Cart"]
        })
    })
})

export const { useAddToCartMutation, useGetCartQuery, useUpdateQuantityMutation, useRemoveProductMutation } = cartApi;