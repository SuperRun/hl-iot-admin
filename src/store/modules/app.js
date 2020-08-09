import Cookies from 'js-cookie';

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus')
      ? !!+Cookies.get('sidebarStatus')
      : true,
  },
  device: 'desktop',
  withoutAnimation: false,
  deviceDetailDialogOpened: false,
  weatherDetailDialogOpened: false,
  editPwdDialogOpened: false,
  deviceDetail: {},
  platformConfig: Cookies.get('platform'),
};
const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1);
    } else {
      Cookies.set('sidebarStatus', 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  OPEN_DEVICEDIALOG: (state) => {
    state.deviceDetailDialogOpened = true;
  },
  CLOSE_DEVICEDIALOG: (state) => {
    state.deviceDetailDialogOpened = false;
  },
  OPEN_WEATHERDIALOG: (state) => {
    state.weatherDetailDialogOpened = true;
  },
  CLOSE_WEATHERDIALOG: (state) => {
    state.weatherDetailDialogOpened = false;
  },
  OPEN_PWDDIALOG: (state) => {
    state.editPwdDialogOpened = true;
  },
  CLOSE_PWDDIALOG: (state) => {
    state.editPwdDialogOpened = false;
  },
  SET_DEVICE_DETAIL: (state, detail) => {
    state.deviceDetail = detail;
  },
  SET_PLATFORM_CONFIG: (state, config) => {
    state.platformConfig = config;
  },
};

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  },
  openDeviceDialog({ commit }) {
    commit('OPEN_DEVICEDIALOG');
  },
  closeDeviceDialog({ commit }) {
    commit('CLOSE_DEVICEDIALOG');
  },
  openWeatherDialog({ commit }) {
    commit('OPEN_WEATHERDIALOG');
  },
  closeWeatherDialog({ commit }) {
    commit('CLOSE_WEATHERDIALOG');
  },
  openPwdDialog({ commit }) {
    commit('OPEN_PWDDIALOG');
  },
  closePwdDialog({ commit }) {
    commit('CLOSE_PWDDIALOG');
  },
  setPlatformConfig({ commit }, config) {
    commit('SET_PLATFORM_CONFIG', config);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
