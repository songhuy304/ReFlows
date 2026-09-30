import { tokenStorage } from "@/lib/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      tokenStorage.clearTokens();
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  initialState,
});

export const selectIsLoading = (state: RootState) => {
  return state.auth.isLoading;
};

export const selectIsAuthenticated = (state: RootState) => {
  return state.auth.isAuthenticated;
};

export const selectUser = (state: RootState) => {
  return state.auth.user;
};

export const { logout, setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;
