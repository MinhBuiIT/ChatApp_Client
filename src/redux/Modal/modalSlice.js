import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isChatListModal: false,
  isProfileModal: false,
  isSearchModal: false,
  isNotificationModal: false,
  isOpenMenuFile: false,
  isLoadingUploadFile: false,
  isOpenAddGroup: false
};
const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    hanldeChatListModal: (state, action) => {
      state.isChatListModal = action.payload;
    },
    handleProfileModal: (state, action) => {
      state.isProfileModal = action.payload;
    },
    handleSearchModal: (state, action) => {
      state.isSearchModal = action.payload;
    },
    handleNotificationModal: (state, action) => {
      state.isNotificationModal = action.payload;
    },
    hanldeIsOpenMenuFile: (state, action) => {
      state.isOpenMenuFile = action.payload;
    },
    handleLoadingUploadFile: (state, action) => {
      state.isLoadingUploadFile = action.payload;
    },
    handleIsOpenAddGroup: (state, action) => {
      state.isOpenAddGroup = action.payload;
    }
  }
});
export const {
  hanldeChatListModal,
  handleProfileModal,
  handleSearchModal,
  handleNotificationModal,
  hanldeIsOpenMenuFile,
  handleLoadingUploadFile,
  handleIsOpenAddGroup
} = modalSlice.actions;
const modalReducer = modalSlice.reducer;
export default modalReducer;
