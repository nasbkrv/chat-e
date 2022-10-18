import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	data: {}
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserData: (state, action) => {
			if (Object.keys(action.payload).length > 0) {
				state.data = { ...state.data, ...action.payload }
			} else {
				state.data = action.payload
			}
		}
	}
})

export const { setUserData } = userSlice.actions

export default userSlice.reducer
