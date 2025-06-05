import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials: { username: string; email: string; password: string }) => ({
        url: 'register/',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials: { username: string; password: string }) => ({
        url: 'login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: (refreshToken: string) => ({
        url: 'logout/',
        method: 'POST',
        body: { refresh: refreshToken },
      }),
    }),
    getUser: builder.query({
      query: () => 'user/',
    }),
  }),
});

// Export hooks for usage in components
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
} = apiSlice;