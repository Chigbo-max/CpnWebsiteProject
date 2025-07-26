import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const subscriberApi = createApi({
  reducerPath: 'subscriberApi',
  baseQuery: fetchBaseQuery({
     baseUrl: import.meta.env.VITE_BASE_API_URL}),
  tagTypes: ['Subscriber'],
  endpoints: (builder) => ({
    getSubscribers: builder.query({
      query: () => '/subscribers',
      providesTags: (result) => {
        const list = Array.isArray(result)
          ? result
          : (result?.subscribers ?? []);
        return list.length
          ? [
              ...list.map(({ id }) => ({ type: 'Subscriber', id })),
              { type: 'Subscriber', id: 'LIST' },
            ]
          : [{ type: 'Subscriber', id: 'LIST' }];
      },
    }),
    addSubscriber: builder.mutation({
      query: (body) => ({
        url: '/subscribers',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Subscriber', id: 'LIST' }],
    }),
    updateSubscriber: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/subscribers/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Subscriber', id },
        { type: 'Subscriber', id: 'LIST' },
      ],
    }),
    deleteSubscriber: builder.mutation({
      query: (idOrEmail) => ({
        url: `/subscribers/${encodeURIComponent(idOrEmail)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, idOrEmail) => [
        { type: 'Subscriber', id: idOrEmail },
        { type: 'Subscriber', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetSubscribersQuery,
  useAddSubscriberMutation,
  useUpdateSubscriberMutation,
  useDeleteSubscriberMutation,
} = subscriberApi; 