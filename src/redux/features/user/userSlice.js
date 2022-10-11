import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	data: {}
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserData: (state, action) => {
			state.data = action.payload
		}
	}
})

export const { setUserData } = userSlice.actions

export default userSlice.reducer
