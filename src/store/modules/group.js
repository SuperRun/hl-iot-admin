import {listGroup, addGroup, editGroup, detailGroup} from '@/api/group';

const actions = {
  listGroup ({commit}, params) {
    return new Promise ((resolve, reject) => {
      listGroup (params).then (res => resolve (res.data));
    });
  },
  addGroup ({commit}, data) {
    return new Promise ((resolve, reject) => {
      addGroup (data).then (res => resolve (res));
    });
  },
  editGroup ({commit}, data) {
    return new Promise ((resolve, reject) => {
      editGroup (data).then (res => resolve (res));
    });
  },
  detailGroup ({commit}, params) {
    return new Promise ((resolve, reject) => {
      detailGroup (params).then (res => resolve (res.data));
    });
  },
};

export default {
  namespaced: true,
  actions,
};
