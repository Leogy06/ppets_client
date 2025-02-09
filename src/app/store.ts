import { configureStore } from "@reduxjs/toolkit";
import authRedecur, { setCredentials } from "@/features/auth/authSlice";
import { apiSlice } from "@/state/api";
export const store = configureStore({
  reducer: {
    auth: authRedecur,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

let isRefreshing = false;

store.subscribe(async () => {
  const state = store.getState();
  if (!state.auth.accessToken && !isRefreshing) {
    isRefreshing = true;
    try {
      const { accessToken } = await store
        .dispatch(apiSlice.endpoints.refresh.initiate({}))
        .unwrap();
      store.dispatch(setCredentials(accessToken));
    } catch {
      console.error("Token refresh failed.");
    }
    isRefreshing = false;
  }
});
