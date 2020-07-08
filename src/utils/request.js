import axios from 'axios';
import {MessageBox, Message} from 'element-ui';
import store from '@/store';
import {getToken} from '@/utils/auth';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000,
});

service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (
      response.config.url == '/device/index' &&
      response.config.params.is_export == 1
    ) {
      return response;
    }

    // 图片上传返回204
    if (response.status !== 204 && res.code !== 200) {
      if (res.code == 401) {
        MessageBox.confirm('登录过期，请重新登录', '确定退出登录', {
          confirmButtonText: '重新登录',
          type: 'warning',
          showClose: false,
          closeOnClickModal: false,
          showCancelButton: false,
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload();
          });
        });
      } else {
        // console.log('Error', res);
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000,
        });
      }
      return Promise.reject(res.msg);
    } else {
      return res;
    }
  },
  (error) => {
    console.log('err' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export default service;
