import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'auth',
	initialState: { token: null },
	reducers: {
		setToken: (state, action) => {
			state.token = action.payload;
		},
	},
});

export const { setToken } = slice.actions;
export default slice.reducer;