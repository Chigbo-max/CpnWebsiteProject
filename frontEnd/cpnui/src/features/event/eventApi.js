import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({ 
      baseUrl: import.meta.env.VITE_BASE_API_URL || 'https://cpnwebsiteproject.onrender.com/api',
  }),
  tagTypes: ['Event'],
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => '/events',
      providesTags: (result) => {
        const list = Array.isArray(result)
          ? result
          : (result?.events ?? []);
        return list.length
          ? [
            ...list.map(({ event_id }) => ({ type: 'Event', id: event_id })),
            { type: 'Event', id: 'LIST' },
          ]
          : [{ type: 'Event', id: 'LIST' }];
      },
    }),
    getEventById: builder.query({
      query: (event_id) => `/events/${event_id}`,
      providesTags: (result, event_id) => [{ type: 'Event', id: event_id }],
    }),
    registerForEvent: builder.mutation({
      query: ({ event_id, ...body }) => ({
        url: `/events/${event_id}/register`,
        method: 'POST',
        body,
      }),
    }),
    createEvent: builder.mutation({
      query: (formData) => ({
        url: '/admin/events',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),
    updateEvent: builder.mutation({
      query: ({ event_id, ...patch }) => ({
        url: `/admin/events/${event_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, { event_id }) => [
        { type: 'Event', id: event_id },
        { type: 'Event', id: 'LIST' },
      ],
    }),
    deleteEvent: builder.mutation({
      query: (event_id) => ({
        url: `/admin/events/${event_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, event_id) => [
        { type: 'Event', id: event_id },
        { type: 'Event', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useRegisterForEventMutation,
} = eventApi; 