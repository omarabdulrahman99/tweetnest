import { createSlice } from "@reduxjs/toolkit";
const initialState = { sendNotif: { context: '', text:'' }};

export const notifSlice = createSlice({
  name: "notif",
  initialState,
  reducers: {
    sendNotif: (state, action) => {state.sendNotif = action.payload;},
  },
});

export const { sendNotif } = notifSlice.actions;
export default notifSlice.reducer;