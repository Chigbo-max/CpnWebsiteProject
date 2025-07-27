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

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryWithAuthErrorHandling,
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/admin/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: '/admin/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    uploadProfileImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return {
          url: '/admin/upload-image',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Profile'],
    }),
    removeProfileImage: builder.mutation({
      query: () => ({
        url: '/admin/profile-picture',
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: '/admin/change-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useRemoveProfileImageMutation,
  useChangePasswordMutation,
} = profileApi;