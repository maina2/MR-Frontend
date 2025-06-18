import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Delivery } from "../types/Delivery";
import type { PaginatedDeliveries } from "../types/Delivery";
import type { PaginatedCustomers } from "../types/Customer";
import type { PaginatedPayments } from "../types/Payment";
import type { PaginatedReports } from "../types/Report";
import type { SearchResponse } from "../types/Search";
import type { BusinessDetails } from "../types/BusinessDetails";
import type { User } from "../types/User";
import type { Stats } from "../types/Stats";

// Basic baseQuery setup with token handling
const baseQuery = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8000/api/",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom baseQuery with enhanced token refresh logic
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      // Attempt to refresh the token
      const refreshResult = await baseQuery(
        {
          url: "refresh/",
          method: "POST",
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const refreshData = refreshResult.data as {
          access: string;
          refresh?: string;
        };
        const newAccessToken = refreshData.access;
        const newRefreshToken = refreshData.refresh || refreshToken;

        // Update tokens in localStorage
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Retry the original query with the new access token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, but keep existing tokens for potential manual retry
        console.warn("Token refresh failed, keeping existing tokens for now.");
        // Optionally, notify the user to re-login after a few failed attempts
      }
    } else {
      console.warn("No refresh token available, authentication required.");
    }
  }

  return result;
};

// Define the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Users",
    "Deliveries",
    "Customers",
    "Payments",
    "BusinessDetails",
    "Reports",
  ],
  endpoints: (builder) => ({
    // Users endpoints
    register: builder.mutation({
      query: (credentials: {
        username: string;
        email: string;
        password: string;
      }) => ({
        url: "register/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Users"],
    }),
    login: builder.mutation({
      query: (credentials: { username: string; password: string }) => ({
        url: "login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Users"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("accessToken", data.access);
          localStorage.setItem("refreshToken", data.refresh);
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    logout: builder.mutation({
      query: (refreshToken: string) => ({
        url: "logout/",
        method: "POST",
        body: { refresh: refreshToken },
      }),
      invalidatesTags: ["Users"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
    getUser: builder.query<User, void>({
      query: () => "profile/",
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: "profile/",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    // Delivery endpoints
    getDelivery: builder.query<Delivery, number>({
      query: (id) => `delivery/${id}/`,
      transformResponse: (response: { data?: Delivery; error?: string }) => {
        if ("error" in response) {
          throw new Error(response.error || "Failed to fetch delivery");
        }
        if (!response.data) {
          throw new Error("No delivery data returned");
        }
        return response.data;
      },
      providesTags: ["Deliveries"],
    }),
    getDeliveries: builder.query<
      PaginatedDeliveries,
      { limit?: number; offset?: number; delivery_status?: string }
    >({
      query: ({ limit = 12, offset = 0, delivery_status }) => ({
        url: "deliveries/",
        params: { limit, offset, ...(delivery_status && { delivery_status }) },
      }),
      providesTags: ["Deliveries"],
    }),
    createDelivery: builder.mutation<Delivery, Partial<Delivery>>({
      query: (newDelivery) => ({
        url: "delivery/",
        method: "POST",
        body: newDelivery,
      }),
      invalidatesTags: ["Deliveries", "Reports"],
    }),
    updateDelivery: builder.mutation<
      Delivery,
      { id: number; data: Partial<Delivery> }
    >({
      query: ({ id, data }) => ({
        url: `delivery/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Deliveries"],
    }),
    deleteDelivery: builder.mutation<void, number>({
      query: (id) => ({
        url: `delivery/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Deliveries"],
    }),
    // Customer endpoints
    getCustomers: builder.query<
      PaginatedCustomers,
      { limit?: number; offset?: number; search?: string }
    >({
      query: ({ limit = 12, offset = 0, search }) => ({
        url: "customers/",
        params: { limit, offset, ...(search && { search }) },
      }),
      providesTags: ["Customers"],
    }),
    // Payment endpoints
    getPayments: builder.query<
      PaginatedPayments,
      { limit?: number; offset?: number; search?: string }
    >({
      query: ({ limit = 12, offset = 0, search }) => ({
        url: "payments/",
        params: { limit, offset, ...(search && { search }) },
      }),
      providesTags: ["Payments"],
    }),
    // Settings endpoints
    getBusinessDetails: builder.query<BusinessDetails | null, void>({
      query: () => 'business-details/',
      transformResponse: (response: { data: BusinessDetails | null }) => response.data,
      providesTags: ['BusinessDetails'],
    }),
    createBusinessDetails: builder.mutation<BusinessDetails, FormData>({
      query: (formData) => ({
        url: 'business-details/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['BusinessDetails'],
    }),
    updateBusinessDetails: builder.mutation<BusinessDetails, FormData>({
      query: (formData) => ({
        url: 'business-details/',
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['BusinessDetails'],
    }),
    // Reports endpoints
    getReports: builder.query<
      PaginatedReports,
      { limit?: number; offset?: number; search?: string }
    >({
      query: ({ limit = 12, offset = 0, search }) => ({
        url: "reports/",
        params: { limit, offset, ...(search && { search }) },
      }),
      providesTags: ["Reports"],
    }),
    getGlobalSearch: builder.query<SearchResponse, { q: string }>({
      query: ({ q }) => ({
        url: "search/",
        params: { q: q.trim() || undefined },
      }),
      providesTags: ["Deliveries"],
    }),
    // Dashboard stats endpoint
    getDashboardStats: builder.query<Stats, void>({
      query: () => 'dashboard/stats/',
      providesTags: ['Deliveries', 'Customers', 'Payments', 'Reports'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useGetDeliveryQuery,
  useGetDeliveriesQuery,
  useCreateDeliveryMutation,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
  useGetCustomersQuery,
  useGetPaymentsQuery,
  useGetBusinessDetailsQuery,
  useCreateBusinessDetailsMutation,
  useUpdateBusinessDetailsMutation,
  useGetReportsQuery,
  useGetGlobalSearchQuery,
  useGetDashboardStatsQuery,
} = apiSlice;
