import {
  listGroup,
  addGroup,
  editGroup,
  destroyGroup,
  detailGroup,
  detailControlGroup,
  deviceListGroup,
  setGroupBrightness,
} from '@/api/group';

const actions = {
  listGroup({commit}, params) {
    return new Promise((resolve, reject) => {
      listGroup(params).then((res) => resolve(res.data));
    });
  },
  addGroup({commit}, data) {
    return new Promise((resolve, reject) => {
      addGroup(data).then((res) => resolve(res));
    });
  },
  editGroup({commit}, data) {
    return new Promise((resolve, reject) => {
      editGroup(data).then((res) => resolve(res));
    });
  },
  destroyGroup({commit}, data) {
    return new Promise((resolve, reject) => {
      destroyGroup(data).then((res) => resolve(res));
    });
  },
  detailGroup({commit}, params) {
    return new Promise((resolve, reject) => {
      detailGroup(params).then((res) => resolve(res.data));
    });
  },
  detailControlGroup({commit}, params) {
    return new Promise((resolve, reject) => {
      detailControlGroup(params).then((res) => resolve(res.data));
    });
  },
  deviceListGroup({commit}, params) {
    return new Promise((resolve, reject) => {
      deviceListGroup(params).then((res) => resolve(res.data));
    });
  },
  setGroupBrightness({commit}, data) {
    return new Promise((resolve, reject) => {
      setGroupBrightness(data).then((res) => resolve(res.data));
    });
  },
};

export default {
  namespaced: true,
  actions,
};
