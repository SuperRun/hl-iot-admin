import request from '@/utils/request';
import {UPLOAD_IMAGE, UPLOAD_VIDEO} from '@/constant/url';

/**
 * @description: 获取上传图片配置
 * @param {object} data
 * @return: 
 */
export function getUploadImgConfig () {
  return request ({
    url: UPLOAD_IMAGE,
    method: 'get',
  });
}

/**
 * @description: 上传图片
 * @param {object} config
 * @return: 
 */
export function uploadImg (config) {
  return request ({
    url: config.url,
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data: config.data,
  });
}

/**
 * @description: 删除图片
 * @param {object} config
 * @return: 
 */
export function delImg (config) {
  return request ({
    url: config.url,
    method: 'delete',
    headers: {Authorization: config.signature},
  });
}

/**
 * @description: 获取上传视频配置
 * @param {object} data
 * @return: 
 */
export function getUploadVideoConfig () {
  return request ({
    url: UPLOAD_VIDEO,
    method: 'get',
  });
}
