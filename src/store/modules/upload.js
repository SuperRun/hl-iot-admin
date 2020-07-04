import {getUploadImgConfig, delImg, getUploadVideoConfig} from '@/api/upload';
import {setUploadimgConfig, setUploadvideoConfig} from '@/utils/auth';

const actions = {
  getUploadImgConfig() {
    return new Promise((resolve, reject) => {
      getUploadImgConfig().then((res) => {
        setUploadimgConfig(res.data);
        resolve(res.data);
      });
    });
  },
  delImg({commit}, config) {
    return new Promise((resolve, reject) => {
      delImg(config)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          console.log('delImg', e);
          reject(e);
        });
    });
  },
  getUploadVideoConfig({commit}, params) {
    return new Promise((resolve, reject) => {
      getUploadVideoConfig(params).then((res) => {
        console.log('getUploadVideoConfig', res);
        setUploadvideoConfig(res.data);
        resolve(res.data);
      });
    });
  },
};

export default {
  namespaced: true,
  actions,
};
