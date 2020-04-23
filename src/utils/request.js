import axios from 'axios';
import {MessageBox, Message} from 'element-ui';
import store from '@/store';

const service = axios.create ({});

service.interceptors.response.use (
  response => {
    const res = response.data;
    return res;
  },
  error => {
    Message ({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
  }
);

export default service;
