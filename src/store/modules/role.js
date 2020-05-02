import {listRole, addRole, editRole} from '@/api/role';

const actions = {
  listRole ({commit}, params) {
    return new Promise ((resolve, reject) => {
      listRole (params).then (res => resolve (res.data));
    });
  },
  addRole ({commit}, data) {
    return new Promise ((resolve, reject) => {
      addRole (data).then (res => resolve (res));
    });
  },
  editRole ({commit}, data) {
    return new Promise ((resolve, reject) => {
      editRole (data).then (res => resolve (res));
    });
  },
};

export default {
  namespaced: true,
  actions,
};
