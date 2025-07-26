import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const newsletterApi = createApi({
  reducerPath: 'newsletterApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BASE_API_URL || 'https://cpnwebsiteproject.onrender.com/api' 
  }),
  tagTypes: ['Newsletter'],
  endpoints: (builder) => ({
    getNewsletters: builder.query({
      query: () => '/admin/newsletters',
      providesTags: (result = []) =>
        result
          ? [
            ...result.map(({ id, _id }) => ({ type: 'Newsletter', id: id || _id })),
            { type: 'Newsletter', id: 'LIST' },
          ]
          : [{ type: 'Newsletter', id: 'LIST' }],
    }),
    createNewsletter: builder.mutation({
      query: (body) => ({
        url: '/admin/newsletters',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Newsletter', id: 'LIST' }],
    }),
    updateNewsletter: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/admin/newsletters/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Newsletter', id },
        { type: 'Newsletter', id: 'LIST' },
      ],
    }),
    deleteNewsletter: builder.mutation({
      query: (id) => ({
        url: `/admin/newsletters/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Newsletter', id },
        { type: 'Newsletter', id: 'LIST' },
      ],
    }),
    sendNewsletter: builder.mutation({
      query: (id) => ({
        url: `/admin/newsletters/${id}/send`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Newsletter', id },
        { type: 'Newsletter', id: 'LIST' },
      ],
    }),
    subscribeNewsletter: builder.mutation({
      query: (body) => ({
        url: '/contact/subscribe',
        method: 'POST',
        body,
      }),
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
  useGetNewslettersQuery,
  useCreateNewsletterMutation,
  useUpdateNewsletterMutation,
  useDeleteNewsletterMutation,
  useSendNewsletterMutation,
  useSubscribeNewsletterMutation,
  useUploadImageMutation,
} = newsletterApi; 