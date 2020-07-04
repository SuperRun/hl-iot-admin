import request from '@/utils/request';
import {
  GROUP_LIST,
  GROUP_ADD,
  GROUP_EDIT,
  GROUP_DETAIL,
  GROUP_CONTROL_DETAIL,
  GROUP_CONTROL,
  GROUP_DESTROY,
  GROUP_DEVICE_LIST,
  GROUP_BRIGHTNESS,
} from '@/constant/url';

/**
 * @description: 分组列表
 * @param {object} params
 * @return:
 */
export function listGroup(params) {
  return request({
    url: GROUP_LIST,
    method: 'get',
    params,
  });
}

/**
 * @description: 添加分组
 * @param {object} data
 * @return:
 */
export function addGroup(data) {
  return request({
    url: GROUP_ADD,
    method: 'post',
    data,
  });
}

/**
 * @description: 编辑分组
 * @param {object} data
 * @return:
 */
export function editGroup(data) {
  return request({
    url: GROUP_EDIT,
    method: 'post',
    data,
  });
}

/**
 * @description: 删除分组
 * @param {object} data
 * @return:
 */
export function destroyGroup(data) {
  return request({
    url: GROUP_DESTROY,
    method: 'post',
    data,
  });
}

/**
 * @description: 分组详情
 * @param {object} data
 * @return:
 */
export function detailGroup(params) {
  return request({
    url: GROUP_DETAIL,
    method: 'get',
    params,
  });
}

/**
 * @description: 分组控灯详情
 * @param {object} data
 * @return:
 */
export function detailControlGroup(params) {
  return request({
    url: GROUP_CONTROL_DETAIL,
    method: 'get',
    params,
  });
}

/**
 * @description: 分组控灯
 * @param {object} data
 * @return:
 */
export function controlGroup(data) {
  return request({
    url: GROUP_CONTROL,
    method: 'post',
    data,
  });
}

/**
 * @description: 分组设备列表
 * @param {object} params
 * @return:
 */
export function deviceListGroup(params) {
  return request({
    url: GROUP_DEVICE_LIST,
    method: 'get',
    params,
  });
}

/**
 * @description: 路灯开关亮度调节
 * @param {object} data
 * @return:
 */
export function setGroupBrightness(data) {
  return request({
    url: GROUP_BRIGHTNESS,
    method: 'post',
    data,
  });
}
