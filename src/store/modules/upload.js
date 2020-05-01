import {getUploadImgConfig, delImg} from '@/api/upload';
import {setUploadimgConfig} from '@/utils/auth';

const actions = {
  getUploadImgConfig () {
    return new Promise ((resolve, reject) => {
      getUploadImgConfig ().then (res => {
        setUploadimgConfig (res.data);
        resolve (res.data);
      });
    });
  },
  delImg ({commit}, config) {
    return new Promise ((resolve, reject) => {
      delImg (config)
        .then (res => {
          resolve (res);
        })
        .catch (e => {
          console.log ('delImg', e);
          reject (e);
        });
    });
  },
};

export default {
  namespaced: true,
  actions,
};
