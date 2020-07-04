import {
  login,
  logout,
  updatePwd,
  getValidCode,
  listUser,
  addUser,
  editUser,
  disableUser,
} from '@/api/user';
import {
  getToken,
  setToken,
  removeToken,
  setUserinfo,
  getUserinfo,
  removeUserinfo,
  removeProjlist,
  removeProjid,
  removeUploadimgConfig,
} from '@/utils/auth';

const state = {
  token: getToken(),
  userInfo: getUserinfo(),
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
};

const actions = {
  userLogin({commit}, data) {
    return new Promise((resolve, reject) => {
      login(data)
        .then((res) => {
          const {tokenType, token, user} = res.data;
          commit('SET_TOKEN', tokenType + ' ' + token);
          commit('SET_USERINFO', user);
          setToken(tokenType + ' ' + token);
          setUserinfo(user);
          resolve();
        })
        .catch((error) => {
          console.log('error', error);
          reject(error);
        });
    });
  },
  logout({commit}) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('SET_TOKEN', '');
          commit('SET_USERINFO', '');
          commit('SET_USERINFO', '');
          removeToken();
          removeUserinfo();
          removeProjlist();
          removeProjid();
          removeUploadimgConfig();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  updatePwd({commit}, data) {
    return new Promise((resolve, reject) => {
      updatePwd(data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getValidCode({commit}) {
    return new Promise((resolve, reject) => {
      getValidCode()
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  listUser({commit}, params) {
    return new Promise((resolve, reject) => {
      listUser(params).then((res) => resolve(res.data));
    });
  },
  addUser({commit}, data) {
    return new Promise((resolve, reject) => {
      addUser(data).then((res) => resolve(res));
    });
  },
  editUser({commit}, data) {
    return new Promise((resolve, reject) => {
      editUser(data).then((res) => resolve(res));
    });
  },
  disableUser({commit}, data) {
    return new Promise((resolve, reject) => {
      disableUser(data).then((res) => resolve(res));
    });
  },
  // 去除token
  resetToken({commit}) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '');
      removeToken();
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
