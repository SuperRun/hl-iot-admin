import {listWarn, closeWarn} from '@/api/fault';
const actions = {
  listWarn({commit}, data) {
    return new Promise((resolve, reject) => {
      listWarn(data).then((res) => {
        resolve(res);
      });
    });
  },
  closeWarn({commit}, data) {
    return new Promise((resolve, reject) => {
      closeWarn(data).then((res) => {
        resolve(res);
      });
    });
  },
};
export default {
  namespaced: true,
  actions,
};
