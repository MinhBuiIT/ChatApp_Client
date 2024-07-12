import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notification_count: Number(localStorage.getItem('notification_count')) || 0,
  alert_message: JSON.parse(localStorage.getItem('alert_message')) || [],
  last_message: []
};
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    handleIncrementNotification: (state) => {
      state.notification_count += 1;
      localStorage.setItem('notification_count', state.notification_count);
    },
    handleResetNotification: (state) => {
      state.notification_count = 0;
      localStorage.setItem('notification_count', 0);
    },
    handleNewMessageAlert: (state, action) => {
      const { chatId } = action.payload;
      const chatAlertState = state.alert_message.find((messageObj) => messageObj._id === chatId);
      if (!chatAlertState) {
        state.alert_message.push({ _id: chatId, count: 1 });
      } else {
        state.alert_message.forEach((messageObj) => {
          if (messageObj._id === chatId) {
            messageObj.count += 1;
          }
        });
      }
      localStorage.setItem('alert_message', JSON.stringify(state.alert_message));
    },
    handleResetNewMessageAlert: (state, action) => {
      const { chatId } = action.payload;
      state.alert_message = state.alert_message.filter((messageObj) => messageObj._id !== chatId);
      localStorage.setItem('alert_message', JSON.stringify(state.alert_message));
    },
    handleNewLastMessage: (state, action) => {
      const index = state.last_message.findIndex((item) => item.chatId === action.payload.chatId);
      if (index === -1) {
        state.last_message.push(action.payload);
      } else {
        state.last_message[index] = action.payload;
      }
    }
  }
});
export const {
  handleIncrementNotification,
  handleResetNotification,
  handleNewMessageAlert,
  handleResetNewMessageAlert,
  handleNewLastMessage
} = chatSlice.actions;
const chatReducer = chatSlice.reducer;
export default chatReducer;
