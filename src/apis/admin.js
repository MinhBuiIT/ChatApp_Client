import http from '../utils/http';

export const loginAdminApi = (data) => {
  return http.post('/api/v1/admin/login', data);
};
export const checkLoginAdminApi = () => {
  return http.get('/api/v1/admin');
};
export const logoutAdminApi = () => {
  return http.post('/api/v1/admin/logout');
};
export const getStatsAdminApi = () => {
  return http.get('/api/v1/admin/stats');
};
export const getUserAdminApi = () => {
  return http.get('/api/v1/admin/user');
};
export const getGroupAdminApi = () => {
  return http.get('/api/v1/admin/group');
};
export const getMessageAdminApi = () => {
  return http.get('/api/v1/admin/messages');
};
