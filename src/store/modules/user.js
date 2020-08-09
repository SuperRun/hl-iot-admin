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
  removePlatform,
  setBtns,
  getBtns,
  removeBtns,
  setTabs,
  getTabs,
  removeTabs,
} from '@/utils/auth';
import { roleAuthList } from '@/api/role';
import { asyncRoutes } from '@/router';

const state = {
  token: getToken(),
  userInfo: getUserinfo(),
  routes: [],
  tabs: getTabs(),
  btns: getBtns(),
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes;
  },
  SET_TABS: (state, tabs) => {
    state.tabs = tabs;
  },
  SET_BTNS: (state, btns) => {
    state.btns = btns;
  },
};

const actions = {
  userLogin({ commit }, data) {
    return new Promise((resolve, reject) => {
      login(data)
        .then((res) => {
          const { tokenType, token, user } = res.data;
          commit('SET_TOKEN', tokenType + ' ' + token);
          commit('SET_USERINFO', user);
          setToken(tokenType + ' ' + token);
          setUserinfo(user);
          resolve(user.role_id);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  userRole({ commit }, data) {
    return new Promise((resolve, reject) => {
      roleAuthList(data)
        .then((res) => {
          const { list } = res.data;
          let routesList = list.filter(
            (item) => item.permission.level == 1 || item.permission.level == 2,
          );
          console.log('list', list);
          console.log('routesList', routesList);
          routesList = routesList.map((route) => route.permission.h5_route);
          routesList = routesList.filter((route) => route != null);
          let tabs = list.filter((item) => item.permission.level == 3);
          tabs = tabs.map((tab) => tab.permission_id);
          let btns = list.filter((item) => item.permission.level == 4);
          btns = btns.map((btn) => btn.permission_id);
          commit('SET_TABS', tabs);
          setBtns(btns);
          setTabs(tabs);
          resolve(routesList);
        })
        .catch((error) => {
          console.log('error', error);
          reject(error);
        });
    });
  },
  dealRoutes({ commit }, data) {
    return new Promise((resolve, reject) => {
      console.log('data', data);
      const filterRoutes = filterAsyncRoutes(asyncRoutes, data);
      console.log('filterRoutes', filterRoutes);
      commit('SET_ROUTES', filterRoutes);
      resolve(filterRoutes);
    });
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('SET_TOKEN', '');
          commit('SET_USERINFO', '');
          removeToken();
          removeUserinfo();
          removeProjlist();
          removeProjid();
          removeUploadimgConfig();
          removePlatform();
          removeBtns();
          removeTabs();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  updatePwd({ commit }, data) {
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
  getValidCode({ commit }) {
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
  listUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      listUser(params).then((res) => resolve(res.data));
    });
  },
  addUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      addUser(data).then((res) => resolve(res));
    });
  },
  editUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      editUser(data).then((res) => resolve(res));
    });
  },
  disableUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      disableUser(data).then((res) => resolve(res));
    });
  },
  // 去除token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '');
      removeToken();
      resolve();
    });
  },
};

function filterAsyncRoutes(asyncRoutes, routes) {
  console.log('routes', routes);
  const res = [];
  asyncRoutes.forEach((route) => {
    const tmp = { ...route };
    console.log('tmp', tmp);
    if (routes.includes(tmp.name) || tmp.children) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, routes);
      }
      res.push(tmp);
    }
  });
  return res;
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
