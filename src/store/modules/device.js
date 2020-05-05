import {
  editDevice,
  addDevice,
  listDevice,
  detailDevice,
  delDevice,
} from '@/api/device';
const state = {};
const actions = {
  editDevice ({commit}, data) {
    return new Promise ((resolve, reject) => {
      editDevice (data).then (res => {
        resolve (res);
      });
    });
  },
  addDevice ({commit}, data) {
    return new Promise ((resolve, reject) => {
      addDevice (data).then (res => {
        resolve (res);
      });
    });
  },
  listDevice ({commit}, params) {
    return new Promise ((resolve, reject) => {
      listDevice (params).then (res => {
        resolve (res.data);
      });
    });
  },
  detailDevice ({commit}, params) {
    return new Promise ((resolve, reject) => {
      detailDevice (params).then (res => {
        resolve (res.data);
      });
    });
  },
  delDevice ({commit}, data) {
    return new Promise ((resolve, reject) => {
      delDevice (data).then (res => {
        resolve (res);
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  actions,
};
