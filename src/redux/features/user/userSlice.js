import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	user: undefined
}

const userSlice = createSlice({
	name: 'userdata',
	initialState,
	reducers: {
		setUserData: (state, action) => {
			state.user = action.payload
		}
	}
})

export const { setUserData } = userSlice.actions

export default userSlice.reducer
