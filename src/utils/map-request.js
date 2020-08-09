import axios from 'axios';

const service = axios.create({
  baseURL:
    process.env.NODE_ENV == 'development'
      ? ''
      : 'http://api.map.baidu.com/place/v2',
  timeout: 5000,
});
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);
export default service;
