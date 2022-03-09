import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = { isAuthenticated: false };

const authSlice = createSlice({
  name: "isAuthenticated",
  initialState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

const store = configureStore({
  reducer: authSlice.reducer,
});

export const authActions = authSlice.actions;

export default store;
