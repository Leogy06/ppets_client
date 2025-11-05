import { Employee, User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  employee: Employee | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  employee: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; message: string; employee: Employee }>
    ) => {
      state.user = action.payload.user;
      state.employee = action.payload.employee;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.employee = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
