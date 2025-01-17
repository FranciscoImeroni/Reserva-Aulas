import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Estado inicial
const initialState = {
  aulaName: '',
  activityName: '',
  selectedVariables: [],
  reservationDays: [],
  reservationHours: [],
  reservations: [], // Para almacenar las reservas del servidor
  status: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,      // Manejo de errores
};

// Thunk para crear una reserva
export const createReservation = createAsyncThunk(
  'reservation/createReservation',
  async (newReservation, { rejectWithValue, getState }) => {
    try {
      const state = getState(); // Obtener el estado de Redux para obtener el token
      const token = state.auth.token; // Asumiendo que el token está almacenado en el estado


      const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
      const response = await fetch(`${DOMAIN_BACK}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Agregar el token JWT aquí
        },
        body: JSON.stringify(newReservation),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Error creating reservation');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create reservation');
    }
  }
);

/* export const createReservation = createAsyncThunk(
  'reservation/createReservation',
  async (newReservation, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReservation),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Error creating reservation');
      }

      const data = await response.json();
      return data; // Retorna la nueva reserva
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create reservation');
    }
  }
); */

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setActivityName: (state, action) => {
      state.activityName = action.payload;
    },
    setSelectedVariables: (state, action) => {
      state.selectedVariables = action.payload;
    },
    setReservationDays: (state, action) => {
      state.reservationDays = action.payload;
    },
    setReservationHours: (state, action) => {
      state.reservationHours = action.payload;
    },
    setAulaName: (state, action) => {
      state.aulaName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReservation.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reservations.push(action.payload); // Agrega la reserva creada
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { 
  setActivityName, 
  setAulaName,
  setSelectedVariables, 
  setReservationDays, 
  setReservationHours
} = reservationSlice.actions;

export default reservationSlice.reducer;
