import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    getInquiries: builder.query({
      query: () => '/admin/inquiries',
      providesTags: (result = [], error, arg) =>
        result
          ? [
              ...result.map(({ id, _id }) => ({ type: 'Contact', id: id || _id })),
              { type: 'Contact', id: 'LIST' },
            ]
          : [{ type: 'Contact', id: 'LIST' }],
    }),
    deleteInquiry: builder.mutation({
      query: (id) => ({
        url: `/admin/inquiries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Contact', id },
        { type: 'Contact', id: 'LIST' },
      ],
    }),
    updateInquiryStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/inquiries/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Contact', id },
        { type: 'Contact', id: 'LIST' },
      ],
    }),
    respondInquiry: builder.mutation({
      query: ({ id, admin_response }) => ({
        url: `/admin/inquiries/${id}`,
        method: 'PUT',
        body: { admin_response },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Contact', id },
        { type: 'Contact', id: 'LIST' },
      ],
    }),
    submitContact: builder.mutation({
      query: (body) => ({
        url: '/contact/submit',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetInquiriesQuery,
  useDeleteInquiryMutation,
  useUpdateInquiryStatusMutation,
  useRespondInquiryMutation,
  useSubmitContactMutation,
} = contactApi; 