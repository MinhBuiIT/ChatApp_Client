import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAdmin: false,
  loader: false,
  userOnline: []
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userExist: (state, action) => {
      state.user = action.payload.user;
      state.loader = true;
    },
    userNotExist: (state) => {
      state.user = null;
      state.loader = true;
    },
    adminExist: (state) => {
      state.isAdmin = true;
    },
    adminNotExist: (state) => {
      state.isAdmin = false;
    },
    addUserOnline: (state, action) => {
      action.payload.forEach((userOnline) => {
        if (!state.userOnline.includes(userOnline)) {
          state.userOnline.push(userOnline);
        }
      });
    },
    removeUserOnline: (state, action) => {
      const { offlineUser } = action.payload;
      const indexUserOnline = state.userOnline.findIndex((item) => item === offlineUser);
      if (indexUserOnline !== -1) {
        state.userOnline.splice(indexUserOnline, 1);
      }
    }
  }
});
export const { userExist, userNotExist, adminExist, adminNotExist, addUserOnline, removeUserOnline } =
  authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
