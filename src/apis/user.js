import http from '../utils/http';

export const getProfileApi = () => {
  return http.get('/api/v1/user/profile');
};
export const getUserApi = (params) => {
  return http.get('/api/v1/user/search', {
    params
  });
};
export const getMyFriendApi = (chatId) => {
  return http.get('/api/v1/user/my-friend', {
    params: { chatId }
  });
};
