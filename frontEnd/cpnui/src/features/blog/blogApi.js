import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BASE_API_URL || 'https://cpnwebsiteproject.onrender.com/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Blog'],
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => '/blog',
      providesTags: (result = []) =>
        result
          ? [
            ...result.map(({ id, _id }) => ({ type: 'Blog', id: id || _id })),
            { type: 'Blog', id: 'LIST' },
          ]
          : [{ type: 'Blog', id: 'LIST' }],
    }),
    getBlog: builder.query({
      query: (id) => `/blog/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),
    createBlog: builder.mutation({
      query: (body) => ({
        url: '/admin/blog',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),
    updateBlog: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/admin/blog/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/admin/blog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),
    uploadImage: builder.mutation({
      query: ({ image }) => ({
        url: '/admin/blog/upload-image',
        method: 'POST',
        body: { image },
      }),
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUploadImageMutation,
} = blogApi; 