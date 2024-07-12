import http from '../utils/http';

export const sendRequestApi = (body) => {
  return http.post('/api/v1/request/send', body);
};
export const getRequestApi = () => {
  return http.get('/api/v1/request/notify');
};
export const reactRequestApi = (body) => {
  return http.post('/api/v1/request/react', body);
};
