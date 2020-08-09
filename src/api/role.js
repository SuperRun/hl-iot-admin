import request from '@/utils/request';
import { ROLE_LIST, ROLE_ADD, ROLE_EDIT, ROLE_DETAIL } from '@/constant/url';

/**
 * @description: 角色列表
 * @param {object} params
 * @return:
 */
export function listRole(params) {
  return request({
    url: ROLE_LIST,
    method: 'get',
    params,
  });
}

/**
 * @description: 添加角色
 * @param {object} data
 * @return:
 */
export function addRole(data) {
  return request({
    url: ROLE_ADD,
    method: 'post',
    data,
  });
}

/**
 * @description: 编辑角色
 * @param {object} data
 * @return:
 */
export function editRole(data) {
  return request({
    url: ROLE_EDIT,
    method: 'post',
    data,
  });
}

/**
 * @description: 角色详情
 * @param {object} data
 * @return:
 */
export function detailRole(params) {
  return request({
    url: ROLE_DETAIL,
    method: 'get',
    params,
  });
}

/**
 * @description: 角色权限
 * @param {object} data
 * @return:
 */
export function roleAuthList(params) {
  return request({
    url: '/role/role_permission',
    method: 'get',
    params,
  });
}
