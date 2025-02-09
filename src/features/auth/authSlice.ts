import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { accessToken: null },
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
