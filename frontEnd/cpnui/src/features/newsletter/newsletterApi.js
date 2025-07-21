import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const newsletterApi = createApi({
  reducerPath: 'newsletterApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation({
      query: (body) => ({
        url: '/contact/subscribe',
        method: 'POST',
        body,
      }),
    }),
    sendNewsletter: builder.mutation({
      query: ({ subject, content, token }) => ({
        url: '/admin/newsletter',
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: { subject, content },
      }),
    }),
    uploadImage: builder.mutation({
      query: ({ image, token }) => ({
        url: '/admin/blog/upload-image',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ image }),
      }),
    }),
  }),
});

export const {
  useSubscribeNewsletterMutation,
  useSendNewsletterMutation,
  useUploadImageMutation,
} = newsletterApi; 