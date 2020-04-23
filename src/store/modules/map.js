import {queryPlace, queryPlaceDetail} from '@/api/map';
const actions = {
  queryPlace ({commit}, param) {
    return new Promise (resolve => {
      queryPlace (param).then (res => {
        resolve (res.result);
      });
    });
  },
  queryPlaceDetail ({commit}, param) {
    return new Promise (resolve => {
      queryPlaceDetail (param).then (res => {
        console.log (res);
        resolve (res.result);
      });
    });
  },
};

export default {
  namespaced: true,
  actions,
};
