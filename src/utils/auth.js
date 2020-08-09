import Cookies from 'js-cookie';

let TokenKey = 'token';
let InfoKey = 'user';
let BtnsKey = 'Btns';
let TabsKey = 'tabs';
let ProjlistKey = 'proj_list';
let ProjidKey = 'proj_id';
let UploadimgKey = 'upload_img';
let UploadvideoKey = 'upload_video';
let PlatformKey = 'platform';

// token
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

// userinfo
export function getUserinfo() {
  return JSON.parse(localStorage.getItem(InfoKey));
}

export function setUserinfo(userinfo) {
  return localStorage.setItem(InfoKey, JSON.stringify(userinfo));
}

export function removeUserinfo() {
  return localStorage.removeItem(InfoKey);
}

// role
export function getBtns() {
  return JSON.parse(localStorage.getItem(BtnsKey));
}

export function setBtns(Btns) {
  return localStorage.setItem(BtnsKey, JSON.stringify(Btns));
}

export function removeBtns() {
  return localStorage.removeItem(BtnsKey);
}
export function getTabs() {
  return JSON.parse(localStorage.getItem(TabsKey));
}

export function setTabs(Tabs) {
  return localStorage.setItem(TabsKey, JSON.stringify(Tabs));
}

export function removeTabs() {
  return localStorage.removeItem(TabsKey);
}

// proj list
export function getProjlist() {
  return JSON.parse(localStorage.getItem(ProjlistKey));
}

export function setProjlist(projList) {
  return localStorage.setItem(ProjlistKey, JSON.stringify(projList));
}

export function removeProjlist() {
  return localStorage.removeItem(ProjlistKey);
}

// proj id
export function getProjid() {
  return JSON.parse(localStorage.getItem(ProjidKey));
}

export function setProjid(projid) {
  return localStorage.setItem(ProjidKey, JSON.stringify(projid));
}

export function removeProjid() {
  return localStorage.removeItem(ProjidKey);
}

// upload
export function getUploadimgConfig() {
  return Cookies.get(UploadimgKey);
}

export function setUploadimgConfig(config) {
  return Cookies.set(UploadimgKey, config);
}

export function removeUploadimgConfig() {
  return Cookies.remove(UploadimgKey);
}
export function getUploadvideoConfig() {
  return Cookies.get(UploadvideoKey);
}

export function setUploadvideoConfig(config) {
  return Cookies.set(UploadvideoKey, config);
}

export function removeUploadvideoConfig() {
  return Cookies.remove(UploadvideoKey);
}

export function setPlatform(config) {
  return Cookies.set(PlatformKey, config);
}

export function getPlatform() {
  return Cookies.get(PlatformKey);
}

export function removePlatform() {
  return Cookies.remove(PlatformKey);
}
