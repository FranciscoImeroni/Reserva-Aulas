import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import reservationReducer from '../features/reservation/reservationSlice';
import authReducer from '../features/reservation/authSlice';

export const store = configureStore({
  reducer: {
    reservation: reservationReducer,
    auth: authReducer, // Agregamos el reducer de auth
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
