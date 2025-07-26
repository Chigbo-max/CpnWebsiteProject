import {configureStore} from '@reduxjs/toolkit';
import navBarReducer from './navBar/navBarSlice';
import podcastReducer from './Podcast/podCastSlice';
import { blogApi } from '../features/blog/blogApi';
import { eventApi } from '../features/event/eventApi';
import { subscriberApi } from '../features/subscriber/subscriberApi';
import { contactApi } from '../features/contact/contactApi';
import { authApi } from '../features/auth/authApi';
import { newsletterApi } from '../features/newsletter/newsletterApi';
import { adminManagementApi } from '../features/admin/adminManagementApi';
import { profileApi } from '../features/admin/profileApi';
import { adminDashboardApi } from '../features/admin/adminDashboardApi';

const store = configureStore({
    reducer: {
      navBar:  navBarReducer,
      podcasts: podcastReducer,
      [blogApi.reducerPath]: blogApi.reducer,
      [eventApi.reducerPath]: eventApi.reducer,
      [subscriberApi.reducerPath]: subscriberApi.reducer,
      [contactApi.reducerPath]: contactApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [newsletterApi.reducerPath]: newsletterApi.reducer,
      [adminManagementApi.reducerPath]: adminManagementApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [adminDashboardApi.reducerPath]: adminDashboardApi.reducer,

    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(blogApi.middleware, eventApi.middleware, subscriberApi.middleware, contactApi.middleware, authApi.middleware, newsletterApi.middleware, adminManagementApi.middleware, profileApi.middleware, adminDashboardApi.middleware),
})

export default store;



