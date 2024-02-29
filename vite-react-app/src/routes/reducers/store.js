import { configureStore } from '@reduxjs/toolkit';
import { api } from './apireducers';
import authReducer from './authSlice';
import notifReducer from './notifSlice';
import notifMiddleware from './notifmiddleware';

export const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer, //both automatically generated.
		auth: authReducer,
		notif: notifReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware).concat(notifMiddleware),
});
