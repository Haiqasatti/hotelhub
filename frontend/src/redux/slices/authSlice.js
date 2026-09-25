import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("hotelhub_token");

let user = null;

try {
  const storedUser = localStorage.getItem("hotelhub_user");

  if (storedUser && storedUser !== "undefined") {
    user = JSON.parse(storedUser);
  }
} catch (error) {
  console.error("Invalid stored user data:", error);
  localStorage.removeItem("hotelhub_user");
}

const initialState = {
  user,
  token,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem(
        "hotelhub_token",
        action.payload.token
      );

      localStorage.setItem(
        "hotelhub_user",
        JSON.stringify(action.payload.user)
      );
    },

    updateUser: (state, action) => {
      state.user = action.payload;

      localStorage.setItem(
        "hotelhub_user",
        JSON.stringify(action.payload)
      );
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("hotelhub_token");
      localStorage.removeItem("hotelhub_user");
    },
  },
});

export const { loginSuccess, updateUser, logout } = authSlice.actions;

export default authSlice.reducer;