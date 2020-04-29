import request from '@/utils/request';
import {
  DEVICE_EDIT,
  DEVICE_ADD,
  DEVICE_LIST,
  DEVICE_DESTROY,
  DEVICE_DETAIL,
} from '@/constant/url';

/**
 * @description: 编辑
 * @param {object} data
 * @return: 
 */
export function editDevice (data) {
  return request ({
    url: DEVICE_EDIT,
    method: 'post',
    data,
  });
}

/**
 * @description: 添加
 * @param {object} data
 * @return: 
 */
export function addDevice (data) {
  return request ({
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
export function listDevice (params) {
  return request ({
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
export function detailDevice (params) {
  return request ({
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
export function delDevice (data) {
  return request ({
    url: DEVICE_DESTROY,
    method: 'post',
    data,
  });
}
