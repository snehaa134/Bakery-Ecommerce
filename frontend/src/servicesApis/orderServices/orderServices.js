
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderServices = createApi({
    reducerPath: "orderServices",

    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000",
        credentials: "include",
    }),

    tagTypes: ["Orders"],

    endpoints: (builder) => ({
        // Create order
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: "/create-order",
                method: "POST",
                body: orderData,
            }),
            invalidatesTags: ["Orders"],
        }),

        // Get logged-in user's orders
        getMyOrders: builder.query({
            query: () => "/my-orders",
            providesTags: ["Orders"],
        }),

        // Get one specific order for the receipt
        getOrderById: builder.query({
            query: (orderId) => `/get-order/${orderId}`,
            providesTags: ["Orders"],
        }),

        // Admin: Get all orders
        getOrders: builder.query({
            query: () => "/get-orders",
            providesTags: ["Orders"],
        }),

        // Admin: Update order status
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/update-order-status/${id}`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["Orders"],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderByIdQuery,
    useGetOrdersQuery,
    useUpdateOrderStatusMutation,
} = orderServices;
