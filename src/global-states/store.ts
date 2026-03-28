import { configureStore } from "@reduxjs/toolkit";

import AuthReducer from "@/src/global-states/slices/authSlice";
import SiteReducer from "@/src/global-states/slices/siteSlice";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    site: SiteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
