import request from '@/utils/request';
import {AUTH_LIST, AUTH_ADD, AUTH_EDIT, AUTH_DETAIL} from '@/constant/url';

/**
 * @description: 权限列表
 * @param {object} params
 * @return:
 */
export function listAuth(params) {
  return request({
    url: AUTH_LIST,
    method: 'get',
    params,
  });
}

/**
 * @description: 添加权限
 * @param {object} data
 * @return:
 */
export function addAuth(data) {
  return request({
    url: AUTH_ADD,
    method: 'post',
    data,
  });
}

/**
 * @description: 编辑权限
 * @param {object} data
 * @return:
 */
export function editAuth(data) {
  return request({
    url: AUTH_EDIT,
    method: 'post',
    data,
  });
}

/**
 * @description: 权限详情
 * @param {object} data
 * @return:
 */
export function detailAuth(params) {
  return request({
    url: AUTH_DETAIL,
    method: 'get',
    params,
  });
}
