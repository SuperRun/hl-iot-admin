import request from '@/utils/request';
import {PLACE_QUERY, PLACE_QUERY_DETAIl} from '@/constant/url';

/**
 * @description: 地点搜索
 * @param {object} params
 * @return: 
 */
export function queryPlace (params) {
  return request ({
    url: PLACE_QUERY,
    method: 'get',
    params,
  });
}
/**
 * @description: 地点详情
 * @param {object} params
 * @return: 
 */
export function queryPlaceDetail (params) {
  return request ({
    url: PLACE_QUERY_DETAIl,
    method: 'get',
    params,
  });
}
