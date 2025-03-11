import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import reservationReducer from '../features/reservation/reservationSlice';
import authReducer from '../features/reservation/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // El estado "auth" debe estar en el store
    reservation: reservationReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
