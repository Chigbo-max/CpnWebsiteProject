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

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: baseQueryWithAuthErrorHandling,
  tagTypes: ['Event', 'EventRegistration'],
  endpoints: (builder) => ({
    // Events endpoints
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
      providesTags: (result, error, event_id) => [{ type: 'Event', id: event_id }],
    }),

    // Registration endpoints
    getEventRegistrations: builder.query({
      query: (event_id) => `/events/${event_id}/registrations`,
      providesTags: (result, error, event_id) => [
        { type: 'EventRegistration', id: event_id },
        ...(result?.map(({ registration_id }) => ({
          type: 'EventRegistration',
          id: registration_id
        })) || []
        ),
      ],
    }),

    getEventRegistrationsCSV: builder.query({
      query: (event_id) => ({
        url: `/events/${event_id}/registrations/csv`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    registerForEvent: builder.mutation({
      query: ({ event_id, ...body }) => ({
        url: `/events/${event_id}/register`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: 'EventRegistration', id: event_id }
      ],
    }),

    // Admin-only endpoints
    createEvent: builder.mutation({
      query: (formData) => ({
        url: '/admin/events',
        method: 'POST',
        body: formData,
        headers: {
        },
        formData: true
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),

    updateEvent: builder.mutation({
      query: ({ event_id, ...patch }) => ({
        url: `/events/${event_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { event_id }) => [
        { type: 'Event', id: event_id },
        { type: 'Event', id: 'LIST' },
      ],
    }),

    deleteEvent: builder.mutation({
      query: (event_id) => ({
        url: `/events/${event_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, event_id) => [
        { type: 'Event', id: event_id },
        { type: 'Event', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useGetEventRegistrationsQuery,
  useLazyGetEventRegistrationsCSVQuery,
  useRegisterForEventMutation,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;