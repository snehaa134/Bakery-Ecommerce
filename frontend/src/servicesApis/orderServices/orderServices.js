
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderServices = createApi({
    reducerPath: "orderServices",

    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000",
        credentials: "include",
    }),

    tagTypes: ["Orders"],

    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: "/create-order",
                method: "POST",
                body: orderData,
            }),
            invalidatesTags: ["Orders"],
        }),

        createRazorpayOrder: builder.mutation({
            query: (orderData) => ({
                url: "/create-razorpay-order",
                method: "POST",
                body: orderData,
            }),
        }),

        verifyRazorpayPayment: builder.mutation({
            query: (paymentData) => ({
                url: "/verify-razorpay-payment",
                method: "POST",
                body: paymentData,
            }),
            invalidatesTags: ["Orders"],
        }),

        getMyOrders: builder.query({
            query: () => "/my-orders",
            providesTags: ["Orders"],
        }),

        getOrderById: builder.query({
            query: (orderId) => `/get-order/${orderId}`,
            providesTags: ["Orders"],
        }),

        getOrders: builder.query({
            query: () => "/get-orders",
            providesTags: ["Orders"],
        }),

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
    useCreateRazorpayOrderMutation,
    useVerifyRazorpayPaymentMutation,
    useGetMyOrdersQuery,
    useGetOrderByIdQuery,
    useGetOrdersQuery,
    useUpdateOrderStatusMutation,
} = orderServices;
