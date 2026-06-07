import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const roomlieApi = createApi({
  reducerPath: 'roomlieApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, // http://localhost:3000/api/v1
    prepareHeaders: (headers, { getState }) => {
      // Küldjük a Neptun kódot minden kérésnél
      const neptun = import.meta.env.VITE_NEPTUN_CODE;
      if (neptun) {
        headers.set('X-Neptun-Code', neptun);
      }

      // Küldjük a tokent, ha be van lépve a felhasználó
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Tables', 'Bookings'],
  endpoints: (builder) => ({
    // ─── AUTENTIKÁCIÓ VÉGPONTOK ──────────────────────────────────────────────
    login: builder.mutation({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
    }),
    register: builder.mutation({
      query: (userData) => ({ url: '/auth/register', method: 'POST', body: userData }),
    }),

    // ─── ASZTALOK KEZELÉSE (SWAGGER ALAPJÁN FIXÁLVA) ─────────────────────────
    getTables: builder.query({
      query: () => '/tables',
      providesTags: ['Tables'],
    }),
    getTableTimeslots: builder.query({
      query: ({ tableId, date }) => `/tables/${tableId}/timeslots?date=${date}`,
      providesTags: ['Bookings', 'Tables'], 
    }),
    addTable: builder.mutation({
      query: (newTable) => ({ url: '/tables', method: 'POST', body: newTable }),
      invalidatesTags: ['Tables'],
    }),
    updateTable: builder.mutation({
      query: ({ id, ...patch }) => ({ 
        url: `/tables/${id}`, 
        method: 'PATCH', 
        body: patch 
      }),
      invalidatesTags: ['Tables'],
    }),
    updateTablePosition: builder.mutation({
      query: ({ id, x, y }) => ({
        url: `/tables/${id}/position`,
        method: 'PATCH',
        body: { x, y }, 
      }),
      invalidatesTags: ['Tables'],
    }),
    deleteTable: builder.mutation({
      query: (id) => ({ 
        url: `/tables/${id}`, 
        method: 'DELETE' 
      }),
      invalidatesTags: ['Tables'],
    }),

    getBookings: builder.query({
      query: () => '/bookings',
      providesTags: ['Bookings'],
    }),

    getMyBookings: builder.query({
      query: () => '/bookings/my',
      providesTags: ['Bookings'],
    }),

    createBooking: builder.mutation({
      query: (bookingData) => ({ 
        url: '/bookings',
        method: 'POST', 
        body: bookingData 
      }),
      invalidatesTags: ['Bookings', 'Tables'],
    }),

    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({ 
        url: `/bookings/${id}/status`, 
        method: 'PATCH', 
        body: { status } 
      }),
      invalidatesTags: ['Bookings'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetTablesQuery,
  useAddTableMutation,
  useUpdateTableMutation,
  useUpdateTablePositionMutation,
  useDeleteTableMutation,
  useGetBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useGetMyBookingsQuery,
  useGetTableTimeslotsQuery
} = roomlieApi;