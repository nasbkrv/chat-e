import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import loaderReducer from './features/loader/loaderSlice'
export const store = configureStore({
	reducer: {
		user: userReducer,
		loader: loaderReducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false
		})
})
