import {login, logout, updatePwd, getValidCode} from '@/api/user';
import {
  getToken,
  setToken,
  removeToken,
  setUserinfo,
  getUserinfo,
  removeUserinfo,
  removeProjlist,
  removeUploadimgConfig,
} from '@/utils/auth';

const state = {
  token: getToken (),
  userInfo: getUserinfo (),
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
  userLogin ({commit}, data) {
    return new Promise ((resolve, reject) => {
      login (data)
        .then (res => {
          const {tokenType, token, user} = res.data;
          commit ('SET_TOKEN', tokenType + ' ' + token);
          commit ('SET_USERINFO', user);
          setToken (tokenType + ' ' + token);
          setUserinfo (user);
          resolve ();
        })
        .catch (error => {
          console.log ('error', error);
          reject (error);
        });
    });
  },
  logout({commit}) {
    return new Promise ((resolve, reject) => {
      logout ()
        .then (() => {
          commit ('SET_TOKEN', '');
          commit ('SET_USERINFO', '');
          removeToken ();
          removeUserinfo ();
          removeProjlist ();
          removeUploadimgConfig ();
          resolve ();
        })
        .catch (error => {
          reject (error);
        });
    });
  },
  updatePwd ({commit}, data) {
    return new Promise ((resolve, reject) => {
      updatePwd (data)
        .then (() => {
          resolve ();
        })
        .catch (error => {
          reject (error);
        });
    });
  },
  getValidCode({commit}) {
    return new Promise ((resolve, reject) => {
      getValidCode ()
        .then (res => {
          resolve (res.data);
        })
        .catch (error => {
          reject (error);
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
