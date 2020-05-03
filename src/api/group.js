import request from '@/utils/request';
import {GROUP_LIST, GROUP_ADD, GROUP_EDIT, GROUP_DETAIL} from '@/constant/url';

/**
 * @description: 分组列表
 * @param {object} params
 * @return: 
 */
export function listGroup (params) {
  return request ({
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
export function addGroup (data) {
  return request ({
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
export function editGroup (data) {
  return request ({
    url: GROUP_EDIT,
    method: 'post',
    data,
  });
}

/**
 * @description: 分组详情
 * @param {object} data
 * @return: 
 */
export function detailGroup (params) {
  return request ({
    url: GROUP_DETAIL,
    method: 'get',
    params,
  });
}
