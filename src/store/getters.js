const getters = {
  sidebar: (state) => state.app.sidebar,
  deviceDetailDialogOpened: (state) => state.app.deviceDetailDialogOpened,
  weatherDetailDialogOpened: (state) => state.app.weatherDetailDialogOpened,
  editPwdDialogOpened: (state) => state.app.editPwdDialogOpened,
  deviceDetail: (state) => state.app.deviceDetail,
  token: (state) => state.user.token,
  userInfo: (state) => state.user.userInfo,
  routes: (state) => state.user.routes,
  btns: (state) => state.user.btns,
  tabs: (state) => state.user.tabs,
  projList: (state) => state.project.projList,
  cur_proj: (state) => state.project.cur_proj,
  platformConfig: (state) => state.app.platformConfig,
};
export default getters;
