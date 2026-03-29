import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type User = {
  userId: string;

  firstname: string;
  surname: string;
  
  email: string;

  role: "admin" | "client" | "superadmin" | "developer";

  companyName: string;
  companyNumber: string;

  addressLine1: string;

  city: string;
  county: string;
  postcode: string;
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
    login: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },

    signup: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },

    setUser: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },

    updateProfile: (
      state,
      action: PayloadAction<Partial<User>>
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { signup, login, logout, setUser, updateProfile } =
  authSlice.actions;

export default authSlice.reducer;