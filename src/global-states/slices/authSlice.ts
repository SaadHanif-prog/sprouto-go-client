import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
  userId: string; // ✅ added userId
  firstname: string;
  surname: string;
  email: string;
  role: "admin" | "client" | "superadmin" | "developer";
};

type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
};

const initialAuthData: AuthState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "AUTH",
  initialState: initialAuthData,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: User }>
    ) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },

    signup: (
      state,
      action: PayloadAction<{ user: User }>
    ) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },

    setUser: (
      state,
      action: PayloadAction<{ user: User }>
    ) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
  },
});

export const { signup, login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;