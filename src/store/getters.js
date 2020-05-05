const getters = {
  sidebar: state => state.app.sidebar,
  deviceDetailDialogOpened: state => state.app.deviceDetailDialogOpened,
  editPwdDialogOpened: state => state.app.editPwdDialogOpened,
  deviceDetail: state => state.app.deviceDetail,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  projList: state => state.project.projList,
  cur_proj: state => state.project.cur_proj,
};
export default getters;
