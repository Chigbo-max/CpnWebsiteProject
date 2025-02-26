import {configureStore} from '@reduxjs/toolkit';
import navBarReducer from './navBar/navBarSlice';
import podCastReducer from './Podcast/podCastSlice'

const store = configureStore({
    reducer: {
      navBar:  navBarReducer,
      podcasts: podCastReducer
    }
})

export default store;

