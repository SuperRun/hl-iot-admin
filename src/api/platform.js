import request from '@/utils/request';
import {SET_SYSTEM, GET_SYSTEM} from '@/constant/url';

/**
 * @description: 获取设置
 * @param {object} data
 * @return:
 */
export function setSystem(data) {
  return request({
    url: SET_SYSTEM,
    method: 'post',
    data,
  });
}

/**
 * @description: 系统设置
 * @return:
 */
export function getSystem() {
  return request({
    url: GET_SYSTEM,
    method: 'get',
  });
}
