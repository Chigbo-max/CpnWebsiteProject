import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL;

export const enrollmentApi = createApi({
  reducerPath: 'enrollmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().adminAuth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Enrollment'],
  endpoints: (builder) => ({
    // Get enrollments with optional date filtering
    getEnrollments: builder.query({
      query: ({ startDate, endDate } = {}) => {
        let url = '/enrollments/admin/enrollments';
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (params.toString()) url += `?${params.toString()}`;
        return url;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.enrollments.map(({ enrollment_id }) => ({ type: 'Enrollment', id: enrollment_id })),
              { type: 'Enrollment', id: 'LIST' },
            ]
          : [{ type: 'Enrollment', id: 'LIST' }],
    }),

    // Get enrollment by ID
    getEnrollmentById: builder.query({
      query: (enrollment_id) => `/enrollments/admin/enrollments/${enrollment_id}`,
      providesTags: (result, error, enrollment_id) => [{ type: 'Enrollment', id: enrollment_id }],
    }),

    // Update enrollment
    updateEnrollment: builder.mutation({
      query: ({ enrollment_id, ...patch }) => ({
        url: `/enrollments/admin/enrollments/${enrollment_id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { enrollment_id }) => [
        { type: 'Enrollment', id: enrollment_id },
        { type: 'Enrollment', id: 'LIST' },
      ],
    }),

    // Delete enrollment
    deleteEnrollment: builder.mutation({
      query: (enrollment_id) => ({
        url: `/enrollments/admin/enrollments/${enrollment_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, enrollment_id) => [
        { type: 'Enrollment', id: enrollment_id },
        { type: 'Enrollment', id: 'LIST' },
      ],
    }),

    // Broadcast email to enrollments
    broadcastToEnrollments: builder.mutation({
      query: (broadcastData) => ({
        url: '/enrollments/admin/enrollments/broadcast',
        method: 'POST',
        body: broadcastData,
      }),
    }),
  }),
});

export const {
  useGetEnrollmentsQuery,
  useGetEnrollmentByIdQuery,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useBroadcastToEnrollmentsMutation,
} = enrollmentApi; 