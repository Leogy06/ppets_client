import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import authReducer from "./features/auth/authSlice";
import { itemsApi } from "./api/itemsApi";
import { accountCodeApi } from "./api/accountCodeApi";
import { employeeApi } from "./api/employeeApi";
import { userApi } from "./api/userApi";
import { transactionApi } from "./api/transactionApi";
import { notificationApi } from "./api/notificationApi";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { dashboardApi } from "./api/dashboardApi";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  auth: authReducer,
  [userApi.reducerPath]: userApi.reducer,
  [itemsApi.reducerPath]: itemsApi.reducer,
  [accountCodeApi.reducerPath]: accountCodeApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [transactionApi.reducerPath]: transactionApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
});

// only persist auth slice
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // must disable for redux-persist
    })
      .concat(authApi.middleware)
      .concat(itemsApi.middleware)
      .concat(accountCodeApi.middleware)
      .concat(employeeApi.middleware)
      .concat(userApi.middleware)
      .concat(transactionApi.middleware)
      .concat(notificationApi.middleware)
      .concat(dashboardApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
