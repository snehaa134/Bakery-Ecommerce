
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const festiveThemeServices = createApi({
    reducerPath: "festiveThemeServices",

    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000",
        credentials: "include",
    }),

    tagTypes: ["Themes"],

    endpoints: (builder) => ({

        addFestiveTheme: builder.mutation({
            query: (themeData) => ({
                url: "/addFestiveTheme",
                method: "POST",
                body: themeData,
            }),
            invalidatesTags: ["Themes"],
        }),

        getAllFestiveThemes: builder.query({
            query: () => "/getAllFestiveThemes",
            providesTags: ["Themes"],
        }),

        getFestiveThemeById: builder.query({
            query: (id) => `/get-FestiveTheme/${id}`,
            providesTags: ["Themes"],
        }),

        updateFestiveTheme: builder.mutation({
            query: ({ id, themeData }) => ({
                url: `/updateFestiveTheme/${id}`,
                method: "PUT",
                body: themeData
            }),
            invalidatesTags: ["Themes"],
        }),

        deleteFestiveTheme: builder.mutation({
            query: (id) => ({
                url: `/deleteFestiveTheme/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Themes"],
        }),

        setManualThemeStatus: builder.mutation({
            query: ({ id, isManuallyActive }) => ({
                url: `/manual-status/${id}`,
                method: "PATCH",
                body: { isManuallyActive },
            }),
            invalidatesTags: ["Themes"],
        }),

        getActiveFestiveTheme: builder.query({
            query: () => "/getActiveFestiveTheme",
            providesTags: ["Themes"],
        }),

    }),
});

export const {
    useAddFestiveThemeMutation,
    useGetAllFestiveThemesQuery,
    useGetFestiveThemeByIdQuery,
    useUpdateFestiveThemeMutation,
    useDeleteFestiveThemeMutation,
    useSetManualThemeStatusMutation,
    useGetActiveFestiveThemeQuery,
} = festiveThemeServices;
