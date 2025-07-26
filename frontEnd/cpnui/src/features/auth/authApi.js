import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
         baseUrl: import.meta.env.VITE_BASE_API_URL || 'https://cpnwebsiteproject.onrender.com/api', 
    }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    me: builder.query({
      query: () => '/auth/me',
    }),
    forgotPasswordRequest: builder.mutation({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),
    getAuditLog: builder.query({
      query: () => '/auth/audit-log',
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useForgotPasswordRequestMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetAuditLogQuery,
} = authApi; 