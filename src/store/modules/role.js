import {
  listRole,
  addRole,
  editRole,
  detailRole,
  roleAuthList,
} from '@/api/role';

const actions = {
  listRole({ commit }, params) {
    return new Promise((resolve, reject) => {
      listRole(params).then((res) => resolve(res.data));
    });
  },
  addRole({ commit }, data) {
    return new Promise((resolve, reject) => {
      addRole(data).then((res) => resolve(res));
    });
  },
  editRole({ commit }, data) {
    return new Promise((resolve, reject) => {
      editRole(data).then((res) => resolve(res));
    });
  },
  detailRole({ commit }, params) {
    return new Promise((resolve, reject) => {
      detailRole(params).then((res) => resolve(res.data));
    });
  },
  roleAuthList({ commit }, params) {
    return new Promise((resolve, reject) => {
      roleAuthList(params).then((res) => resolve(res.data));
    });
  },
};

export default {
  namespaced: true,
  actions,
};
