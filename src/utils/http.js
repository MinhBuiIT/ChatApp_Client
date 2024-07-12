import axios from 'axios';
class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }
}
const http = new Http().instance;
export default http;
