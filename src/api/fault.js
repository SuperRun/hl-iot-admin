import request from '@/utils/request';
import {WARN_LIST, WARN_CLOSE} from '@/constant/url';

/**
 * @description: 告警列表
 * @param {object} data
 * @return:
 */
export function listWarn(params) {
  return request({
    url: WARN_LIST,
    method: 'GET',
    params,
  });
}

/**
 * @description: 关闭告警
 * @param {object} data
 * @return:
 */
export function closeWarn(data) {
  return request({
    url: WARN_CLOSE,
    method: 'post',
    data,
  });
}
