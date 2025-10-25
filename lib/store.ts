import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import authReducer from "./features/auth/authSlice";
import { itemsApi } from "./api/itemsApi";
import { accountCodeApi } from "./api/accountCodeApi";
import { employeeApi } from "./api/employeeApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    // [usersApi.reducerPath]: usersApi.reducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
    [accountCodeApi.reducerPath]: accountCodeApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(itemsApi.middleware)
      .concat(accountCodeApi.middleware)
      .concat(employeeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
