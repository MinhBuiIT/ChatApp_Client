import http from '../utils/http.js';

export const registerApi = (body) => {
  return http.post('/api/v1/user/register', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
  });
};
export const loginApi = (body) => {
  return http.post('/api/v1/user/login', body);
};

export const logoutApi = () => {
  return http.post('/api/v1/user/logout');
};
