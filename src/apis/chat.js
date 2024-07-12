import http from '../utils/http.js';

export const chatListApi = () => {
  return http.get('/api/v1/chat/my-list');
};
export const chatDetailApi = (chatId, populate = false) => {
  return http.get(`/api/v1/chat/${chatId}`, { params: { populate } });
};
export const getMessagesApi = (chatId, page, limit = 10) => {
  return http.get(`/api/v1/chat/${chatId}/messages`, { params: { page, limit } });
};
export const uploadAttachmentApi = (chatId, data) => {
  return http.post(`/api/v1/chat/attachment/${chatId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
  });
};
export const createGroupApi = (data) => {
  return http.post('/api/v1/chat/new-group', data);
};
export const getMyGroupApi = () => {
  return http.get('/api/v1/chat/my-group');
};
export const renameGroupApi = (chatId, data) => {
  return http.put(`/api/v1/chat/${chatId}`, data);
};
export const removeMemberGroupApi = (data) => {
  return http.put('/api/v1/chat/remove-member', data);
};
export const addMemberGroupApi = (data) => {
  return http.put('/api/v1/chat/add-member', data);
};
export const removeChatApi = (chatId) => {
  return http.delete(`/api/v1/chat/${chatId}`);
};
export const leaveGroupApi = (chatId) => {
  return http.delete(`/api/v1/chat/leave/${chatId}`);
};
