import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_API_URL || 'https://cpnwebsiteproject.onrender.com/api',
   }),
  tagTypes: ['Blog'],
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => '/blog',
      providesTags: (result) =>
        result && Array.isArray(result.blogs)
          ? [
              ...result.blogs.map(({ id }) => ({ type: 'Blog', id })),
              { type: 'Blog', id: 'LIST' },
            ]
          : [{ type: 'Blog', id: 'LIST' }],
    }),
    getBlogBySlug: builder.query({
      query: (slug) => `/blog/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
    }),
    createBlog: builder.mutation({
      query: (formData) => ({
        url: '/admin/blog',
        method: 'POST',
        body: formData,
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
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi; 