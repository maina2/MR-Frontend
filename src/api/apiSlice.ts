import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Delivery } from '../types/Delivery'; 

// Define the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8000/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
    }),
    logout: builder.mutation({
      query: (refreshToken: string) => ({
        url: 'logout/',
        method: 'POST',
        body: { refresh: refreshToken },
      }),
      invalidatesTags: ['Users'],
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
        url: 'delivery/',
        method: 'POST',
        body: newDelivery,
      }),
      invalidatesTags: ['Deliveries'],
    }),
    updateDelivery: builder.mutation<Delivery, { id: number; data: Partial<Delivery> }>({
      query: ({ id, data }) => ({
        url: `delivery/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Deliveries'],
    }),
    deleteDelivery: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `delivery/${id}/delete`,
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