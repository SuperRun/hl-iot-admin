import request from '@/utils/request';
import {
  PRODUCT_EDIT,
  PRODUCT_ADD,
  PRODUCT_LIST,
  PRODUCT_DESTROY,
  PRODUCT_DETAIL,
} from '@/constant/url';

/**
 * @description: 编辑
 * @param {object} data
 * @return: 
 */
export function editProduct (data) {
  return request ({
    url: PRODUCT_EDIT,
    method: 'post',
    data,
  });
}

/**
 * @description: 添加
 * @param {object} data
 * @return: 
 */
export function addProduct (data) {
  return request ({
    url: PRODUCT_ADD,
    method: 'post',
    data,
  });
}

/**
 * @description: 列表
 * @param {object} params
 * @return: 
 */
export function listProduct (params) {
  return request ({
    url: PRODUCT_LIST,
    method: 'get',
    params,
  });
}

/**
 * @description: 详情
 * @param {object} params
 * @return: 
 */
export function detailProduct (params) {
  return request ({
    url: PRODUCT_DETAIL,
    method: 'get',
    params,
  });
}

/**
 * @description: 删除
 * @param {object} data
 * @return: 
 */
export function delProduct (data) {
  return request ({
    url: PRODUCT_DESTROY,
    method: 'post',
    data,
  });
}
