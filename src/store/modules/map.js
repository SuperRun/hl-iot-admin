import { queryPlace, queryPlaceDetail } from '@/api/map';
const actions = {
  queryPlace({ commit }, param) {
    return new Promise((resolve) => {
      queryPlace(param).then((res) => {
        resolve(res.data);
      });
    });
  },
  queryPlaceDetail({ commit }, param) {
    return new Promise((resolve) => {
      queryPlaceDetail(param).then((res) => {
        resolve(res.data);
      });
    });
  },
};

export default {
  namespaced: true,
  actions,
};
