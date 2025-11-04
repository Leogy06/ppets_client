import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import authReducer from "./features/auth/authSlice";
import { itemsApi } from "./api/itemsApi";
import { accountCodeApi } from "./api/accountCodeApi";
import { employeeApi } from "./api/employeeApi";
import { userApi } from "./api/userApi";
import { transactionApi } from "./api/transactionApi";
import { notificationApi } from "./api/notificationApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
    [accountCodeApi.reducerPath]: accountCodeApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(itemsApi.middleware)
      .concat(accountCodeApi.middleware)
      .concat(employeeApi.middleware)
      .concat(userApi.middleware)
      .concat(transactionApi.middleware)
      .concat(notificationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
