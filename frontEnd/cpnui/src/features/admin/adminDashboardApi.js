import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminDashboardApi = createApi({
  reducerPath: 'adminDashboardApi',
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
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: () => ({
        url: '/admin/dashboard/analytics',
        method: 'GET',
      }),
    }),
    getEnrolleesCount: builder.query({
      query: () => '/enrollments/admin/enrollments',
      transformResponse: (response) => response.enrollments?.length || 0,
    }),
    getSubscribersCount: builder.query({
      query: () => '/subscribers',
      transformResponse: (response) => response.subscribers?.length || 0,
    }),
    getEventsCount: builder.query({
      query: () => '/events',
      transformResponse: (response) => response.events?.length || 0,
    }),
    getBlogsCount: builder.query({
      query: () => '/blog',
      transformResponse: (response) => response.blogs?.length || 0,
    }),
    getMonthlySubscriberCounts: builder.query({
      query: () => '/subscribers/monthly-counts',
      transformResponse: (response) => 
        response.data?.map(m => ({ 
          name: `${m.year}-${String(m.month).padStart(2, '0')}`, 
          count: Number(m.count) 
        })) || [],
    }),
    getMonthlyEnrolleeCounts: builder.query({
      query: () => '/enrollments/monthly-counts?months=60',
      transformResponse: (response) => 
        response.data?.map(m => ({ 
          name: `${m.year}-${String(m.month).padStart(2, '0')}`, 
          count: Number(m.count) 
        })) || [],
    }),
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetDashboardAnalyticsQuery,
  useGetEnrolleesCountQuery,
  useGetSubscribersCountQuery,
  useGetEventsCountQuery,
  useGetBlogsCountQuery,
  useGetMonthlySubscriberCountsQuery,
  useGetMonthlyEnrolleeCountsQuery,
  useAdminLoginMutation,
} = adminDashboardApi;