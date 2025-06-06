import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Delivery } from '../types/Delivery'; 
import { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Define BaseQueryFn manually
type BaseQueryFn<
  Args = string | FetchArgs,
  Result = unknown,
  Error = FetchBaseQueryError
> = (args: Args, api: any, extraOptions: any) => Promise<{ data?: Result; error?: Error }>;

// Define the refresh response type
interface RefreshResponse {
  access: string;
  refresh?: string;
}

// Basic baseQuery setup
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://127.0.0.1:8000/api/',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom baseQuery with token refresh logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: 'refresh/', // Adjust URL based on your backend
          method: 'POST',
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const refreshData = refreshResult.data as RefreshResponse;
        const newAccessToken = refreshData.access;
        const newRefreshToken = refreshData.refresh || refreshToken;

        // Update localStorage with new tokens
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry the original request with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Logout if refresh fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
  return result;
};

// Define the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Users', 'Deliveries', 'Customers'],
  endpoints: (builder) => ({
    // Users endpoints
    register: builder.mutation({
      query: (credentials: { username: string; email: string; password: string }) => ({
        url: 'register/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Users'],
    }),
    login: builder.mutation({
      query: (credentials: { username: string; password: string }) => ({
        url: 'login/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Users'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Assuming login response includes access and refresh tokens
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
    logout: builder.mutation({
      query: (refreshToken: string) => ({
        url: 'logout/',
        method: 'POST',
        body: { refresh: refreshToken },
      }),
      invalidatesTags: ['Users'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
    }),
    getUser: builder.query({
      query: () => 'user/',
      providesTags: ['Users'],
    }),

    // Delivery endpoints
    getDeliveries: builder.query<Delivery[], void>({
      query: () => 'deliveries/',
      providesTags: ['Deliveries'],
    }),
    createDelivery: builder.mutation<Delivery, Partial<Delivery>>({
      query: (newDelivery) => ({
        url: 'deliveries/', // Fixed URL to match backend
        method: 'POST',
        body: newDelivery,
      }),
      invalidatesTags: ['Deliveries'],
    }),
    updateDelivery: builder.mutation<Delivery, { id: number; data: Partial<Delivery> }>({
      query: ({ id, data }) => ({
        url: `deliveries/${id}/`, // Fixed URL to match backend
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Deliveries'],
    }),
    deleteDelivery: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `deliveries/${id}/delete/`, // Fixed URL to match backend
        method: 'DELETE',
      }),
      invalidatesTags: ['Deliveries'],
    }),

    // Customer endpoints
    getCustomers: builder.query({
      query: () => 'customers/',
      providesTags: ['Customers'],
    }),
    createCustomer: builder.mutation({
      query: (data) => ({
        url: 'customers/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Customers'],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, data }) => ({
        url: `customers/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Customers'],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `customers/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customers'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
  useGetDeliveriesQuery,
  useCreateDeliveryMutation,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = apiSlice;