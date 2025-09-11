import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_BASE_API_URL || '';

export const adminManagementApi = createApi({
  reducerPath: 'adminManagementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    getAdmins: builder.query({
      query: () => '/admin/admins',
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Admin', id })),
            { type: 'Admin', id: 'LIST' },
          ]
          : [{ type: 'Admin', id: 'LIST' }],
    }),
    addAdmin: builder.mutation({
      query: (body) => ({
        url: '/admin/admins',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Admin', id: 'LIST' }],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Admin', id },
        { type: 'Admin', id: 'LIST' },
      ],
    }),
    resetAdminPassword: builder.mutation({
      query: (id) => ({
        url: `/admin/admins/${id}/reset-password`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useAddAdminMutation,
  useDeleteAdminMutation,
  useResetAdminPasswordMutation,
} = adminManagementApi;