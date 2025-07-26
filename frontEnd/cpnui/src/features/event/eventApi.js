import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_BASE_API_URL || 'https://cpnwebsiteproject.onrender.com/api' 
  }),
  tagTypes: ['Event'],
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => '/events',
      providesTags: (result = []) =>
        result
          ? [
            ...result.map(({ id, _id }) => ({ type: 'Event', id: id || _id })),
            { type: 'Event', id: 'LIST' },
          ]
          : [{ type: 'Event', id: 'LIST' }],
    }),
    getEvent: builder.query({
      query: (id) => `/events/${id}`,
      providesTags: (result, error, id) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation({
      query: (body) => ({
        url: '/admin/events',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/admin/events/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Event', id },
        { type: 'Event', id: 'LIST' },
      ],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/admin/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Event', id },
        { type: 'Event', id: 'LIST' },
      ],
    }),
    registerForEvent: builder.mutation({
      query: (body) => ({
        url: '/enrollments',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useRegisterForEventMutation,
} = eventApi; 