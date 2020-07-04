import {
  editProject,
  addProject,
  listProject,
  detailProject,
  delProject,
} from '@/api/project';
import {getProjlist, setProjlist, setProjid, getProjid} from '@/utils/auth';

const state = {
  projList: getProjlist () || [], // 全部项目列表
  cur_proj: getProjid (), // 当前选中的项目
};

const mutations = {
  SET_PROJLIST (state, projList) {
    state.projList = projList;
  },
  SET_CURPROJ (state, cur_proj) {
    state.cur_proj = cur_proj;
    setProjid (cur_proj);
  },
};

const actions = {
  allProject({commit}) {
    return new Promise ((resolve, reject) => {
      listProject ().then (res => {
        const {list} = res.data;
        commit ('SET_PROJLIST', list);
        setProjlist (list);
        const pId = getProjid ();
        const result = list.some (item => item.id == pId);
        console.log ('result', result);
        if (list.length > 0 && !result) {
          commit ('SET_CURPROJ', list[0].id);
        }
        resolve ();
      });
    });
  },
  editProject ({commit}, data) {
    return new Promise ((resolve, reject) => {
      editProject (data).then (res => {
        resolve (res);
      });
    });
  },
  addProject ({commit}, data) {
    return new Promise ((resolve, reject) => {
      addProject (data).then (res => {
        resolve (res);
      });
    });
  },
  listProject ({commit}, params) {
    return new Promise ((resolve, reject) => {
      listProject (params).then (res => {
        resolve (res.data);
      });
    });
  },
  detailProject ({commit}, params) {
    return new Promise ((resolve, reject) => {
      detailProject (params).then (res => {
        resolve (res.data);
      });
    });
  },
  delProject ({commit}, data) {
    return new Promise ((resolve, reject) => {
      delProject (data).then (res => {
        resolve (res);
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
