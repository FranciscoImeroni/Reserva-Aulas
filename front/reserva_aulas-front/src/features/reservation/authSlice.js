

import { createSlice } from '@reduxjs/toolkit';

// Estado inicial
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,};

// Reducción para manejar el estado de autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("SetUser action payload:", action.payload);
      

      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    },
  },
  
});


export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
