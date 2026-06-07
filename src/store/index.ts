import { configureStore } from '@reduxjs/toolkit';
import { roomlieApi } from './apiSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    [roomlieApi.reducerPath]: roomlieApi.reducer,
    // A saját auth szeletünk
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(roomlieApi.middleware),
});