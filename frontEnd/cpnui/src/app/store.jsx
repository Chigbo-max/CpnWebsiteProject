import {configureStore} from '@reduxjs/toolkit';
import navBarReducer from './navBar/navBarSlice';

const store = configureStore({
    reducer: {
      navBar:  navBarReducer,
    }
})

export default store;

