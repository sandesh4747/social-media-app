import { configureStore } from "@reduxjs/toolkit";
import { mainApi } from "../mainApi";
import { authApi } from "../../features/authentication/authApi";
import { userSlice } from "../../features/user/userSlice";

export const store = configureStore({
  reducer: {
    [mainApi.reducerPath]: mainApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userSlice.reducerPath]: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mainApi.middleware),
});
