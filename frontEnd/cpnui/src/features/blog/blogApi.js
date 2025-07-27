import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Custom baseQuery that handles authentication errors
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom baseQuery with auth error handling
const baseQueryWithAuthErrorHandling = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);
  
  // Handle 401 errors by logging out the user
  if (result.error && result.error.status === 401) {
    console.error('Token expired - logging out automatically');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    // You could dispatch a logout action here if using Redux for auth state
    window.location.href = '/admin/login';
  }
  
  return result;
};

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: baseQueryWithAuthErrorHandling,
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