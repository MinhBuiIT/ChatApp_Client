import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth/authSlice.js';
import chatReducer from './Chat/chatSlice.js';
import modalReducer from './Modal/modalSlice.js';
const store = configureStore({
  reducer: { auth: authReducer, modal: modalReducer, chat: chatReducer }
});
export default store;
