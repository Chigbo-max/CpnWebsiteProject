import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_BASE_API_URL || '';

export const userManagementApi = createApi({
  reducerPath: 'userManagementApi',
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users/admin/users',
      providesTags: (result) =>
        result?.users
          ? [
              ...result.users.map((user) => ({ type: 'User', id: user._id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    getUserStats: builder.query({
      query: () => '/users/admin/users/stats',
      providesTags: [{ type: 'User', id: 'STATS' }],
    }),
    exportUsersPdf: builder.query({
      query: () => ({
        url: '/users/admin/users/export',
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/users/admin/users/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'STATS' },
      ],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: 'STATS' },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useExportUsersPdfQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userManagementApi;
