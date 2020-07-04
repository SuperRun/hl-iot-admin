import request from '@/utils/request';
import {
  DEVICE_EDIT,
  DEVICE_EDIT_LOCATION,
  DEVICE_ADD,
  DEVICE_LIST,
  DEVICE_DESTROY,
  DEVICE_DETAIL,
  DEVICE_COUNT,
  DEVICE_REFRESH,
  DEVICE_FIRST,
  LED_TURN,
  GET_LED_BRIGHTNESS,
  SET_LED_BRIGHTNESS,
  LED_OPEN_STATE,
  LED_UPLOAD,
  LED_UPLOAD_DETAIL,
  LED_CLEAR_FILE,
  LIGHT_REFRESH,
  LED_RESTART,
  LED_WEATHER,
  CAMERA_TOKEN,
  CAMERA_DIRECTION,
} from '@/constant/url';

/**
 * @description: 编辑
 * @param {object} data
 * @return:
 */
export function editDevice(data) {
  return request({
    url: DEVICE_EDIT,
    method: 'post',
    data,
  });
}

/**
 * @description: 编辑经纬度
 * @param {object} data
 * @return:
 */
export function editDeviceLocation(data) {
  return request({
    url: DEVICE_EDIT_LOCATION,
    method: 'post',
    data,
  });
}

/**
 * @description: 添加
 * @param {object} data
 * @return:
 */
export function addDevice(data) {
  return request({
    url: DEVICE_ADD,
    method: 'post',
    data,
  });
}

/**
 * @description: 列表
 * @param {object} params
 * @return:
 */
export function listDevice(params) {
  return request({
    url: DEVICE_LIST,
    method: 'get',
    params,
  });
}

/**
 * @description: 详情
 * @param {object} params
 * @return:
 */
export function detailDevice(params) {
  return request({
    url: DEVICE_DETAIL,
    method: 'get',
    params,
  });
}

/**
 * @description: 删除
 * @param {object} data
 * @return:
 */
export function delDevice(data) {
  return request({
    url: DEVICE_DESTROY,
    method: 'post',
    data,
  });
}

/**
 * @description: 设备数目统计
 * @param {object} data
 * @return:
 */
export function countDevice(params) {
  return request({
    url: DEVICE_COUNT,
    method: 'get',
    params,
  });
}

/**
 * @description: 每种类型第一个设备详情数据
 * @param {object} data
 * @return:
 */
export function firstDevice(params) {
  return request({
    url: DEVICE_FIRST,
    method: 'get',
    params,
  });
}

/**
 * @description: 照明灯读状态
 * @param {object} data
 * @return:
 */
export function refreshDevice(data) {
  return request({
    url: DEVICE_REFRESH,
    method: 'post',
    data,
  });
}

/**
 * @description: led屏开关
 * @param {object} data
 * @return:
 */
export function turnLED(data) {
  return request({
    url: LED_TURN,
    method: 'post',
    data,
  });
}

/**
 * @description: led屏开关
 * @param {object} data
 * @return:
 */
export function setLedLightness(data) {
  return request({
    url: SET_LED_BRIGHTNESS,
    method: 'post',
    data,
  });
}

/**
 * @description: 获取led屏亮度
 * @param {object} data
 * @return:
 */
export function getLedLightness(params) {
  return request({
    url: GET_LED_BRIGHTNESS,
    method: 'get',
    params,
  });
}

/**
 * @description: 获取led屏开关状态
 * @param {object} data
 * @return:
 */
export function getLedOpenState(params) {
  return request({
    url: LED_OPEN_STATE,
    method: 'get',
    params,
  });
}

/**
 * @description: led屏幕上传图片或视频
 * @param {object} data
 * @return:
 */
export function uploadLedImgOrVedio(data) {
  return request({
    url: LED_UPLOAD,
    method: 'post',
    data,
  });
}

/**
 * @description: 获取led屏幕图片和视频
 * @param {object} data
 * @return:
 */
export function getLedImgOrVedio(params) {
  return request({
    url: LED_UPLOAD_DETAIL,
    method: 'get',
    params,
  });
}

/**
 * @description: 获取led屏幕图片和视频
 * @param {object} data
 * @return:
 */
export function clearLedFile(data) {
  return request({
    url: LED_CLEAR_FILE,
    method: 'post',
    data,
  });
}

/**
 * @description: 刷新
 * @param {object} data
 * @return:
 */
export function refreshLight(data) {
  return request({
    url: LIGHT_REFRESH,
    method: 'post',
    data,
  });
}

/**
 * @description: 重启LED
 * @param {object} data
 * @return:
 */
export function restartLed(data) {
  return request({
    url: LED_RESTART,
    method: 'post',
    data,
  });
}

/**
 * @description: led气象数据列表
 * @param {object} data
 * @return:
 */
export function getLedWeatherData(params) {
  return request({
    url: LED_WEATHER,
    method: 'get',
    params,
  });
}

/**
 * @description: 获取摄像头TOKEN
 * @param {object} data
 * @return:
 */
export function getCameraToken() {
  return request({
    url: CAMERA_TOKEN,
    method: 'GET',
  });
}

/**
 * @description: 设置摄像头方向
 * @param {object} data
 * @return:
 */
export function setCameraDirection(data) {
  return request({
    url: CAMERA_DIRECTION,
    method: 'POST',
    data,
  });
}
