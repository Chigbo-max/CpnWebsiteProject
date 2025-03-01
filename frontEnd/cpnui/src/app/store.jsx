import {configureStore} from '@reduxjs/toolkit';
import navBarReducer from './navBar/navBarSlice';
import podcastReducer from './Podcast/PodcastSlice'

const store = configureStore({
    reducer: {
      navBar:  navBarReducer,
      podcasts: podcastReducer,
    }
})

export default store;



