import request from '@/utils/request';
import {PLACE_QUERY, PLACE_QUERY_DETAIl} from '@/utils/url';

/**
 * @description: 地点搜索
 * @param {object} param
 * @return: 
 */
export function queryPlace (param) {
  return request ({
    url: `${PLACE_QUERY}&query=${param.query}&region=${param.region}`,
    methods: 'get',
  });
}
/**
 * @description: 地点详情
 * @param {object} param
 * @return: 
 */
export function queryPlaceDetail (param) {
  return request ({
    url: `${PLACE_QUERY_DETAIl}&uid=${param.uid}&scope=${param.scope}`,
    methods: 'get',
  });
}
