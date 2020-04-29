import request from '@/utils/request';
import {
  PROJECT_EDIT,
  PROJECT_ADD,
  PROJECT_LIST,
  PROJECT_DESTROY,
  PROJECT_DETAIL,
} from '@/constant/url';

/**
 * @description: 编辑
 * @param {object} data
 * @return: 
 */
export function editProject (data) {
  return request ({
    url: PROJECT_EDIT,
    method: 'post',
    data,
  });
}

/**
 * @description: 添加
 * @param {object} data
 * @return: 
 */
export function addProject (data) {
  return request ({
    url: PROJECT_ADD,
    method: 'post',
    data,
  });
}

/**
 * @description: 列表
 * @param {object} params
 * @return: 
 */
export function listProject (params) {
  return request ({
    url: PROJECT_LIST,
    method: 'get',
    params,
  });
}

/**
 * @description: 详情
 * @param {object} params
 * @return: 
 */
export function detailProject (params) {
  return request ({
    url: PROJECT_DETAIL,
    method: 'get',
    params,
  });
}

/**
 * @description: 删除
 * @param {object} data
 * @return: 
 */
export function delProject (data) {
  return request ({
    url: PROJECT_DESTROY,
    method: 'post',
    data,
  });
}
