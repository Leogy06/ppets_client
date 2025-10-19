import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    // [usersApi.reducerPath]: usersApi.reducer,
    // [itemsApi.reducerPath]: itemsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
  //   .concat(usersApi.middleware)
  //   .concat(itemsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
