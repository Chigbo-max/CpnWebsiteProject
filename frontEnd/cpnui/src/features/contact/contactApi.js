import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    getInquiries: builder.query({
      query: () => '/admin/inquiries',
      providesTags: (result = []) =>
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
      invalidatesTags: (id) => [
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
      invalidatesTags: ({ id }) => [
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
      invalidatesTags: ( { id }) => [
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