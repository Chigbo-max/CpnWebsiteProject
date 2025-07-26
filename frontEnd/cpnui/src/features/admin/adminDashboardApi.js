import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_BASE_API_URL;

export const adminDashboardApi = createApi({
  reducerPath: 'adminDashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAnalytics: builder.query({
      query: () => ({
        url: '/api/admin/analytics',
        method: 'GET',
      }),
      transformResponse: (response) => ({
        enrollees: response.enrollments?.length || 0,
        subscribers: response.subscribers?.length || 0,
        events: response.events?.length || 0,
        blogs: response.blogs?.length || 0,
      }),
    }),
    getMonthlySubscribers: builder.query({
      query: () => ({
        url: '/api/subscribers/monthly-counts',
        method: 'GET',
      }),
      transformResponse: (response) => ({
        data: response.data.map(m => ({
          year: m.year,
          month: m.month,
          count: Number(m.count)
        }))
      }),
    }),
    getMonthlyEnrollees: builder.query({
      query: () => ({
        url: '/api/enrollments/monthly-counts?months=60',
        method: 'GET',
      }),
      transformResponse: (response) => ({
        data: response.data.map(m => ({
          year: m.year,
          month: m.month,
          count: Number(m.count)
        }))
      }),
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetMonthlySubscribersQuery,
  useGetMonthlyEnrolleesQuery,
} = adminDashboardApi;