import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiBaseUrl = import.meta.env.VITE_BASE_API_URL || '';

// Custom baseQuery that handles authentication errors
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
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

export const enrollmentApi = createApi({
  reducerPath: 'enrollmentApi',
  baseQuery: baseQueryWithAuthErrorHandling,
  tagTypes: ['Enrollment'],
  endpoints: (builder) => ({
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