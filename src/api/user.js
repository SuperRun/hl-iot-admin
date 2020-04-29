import request from '@/utils/request';
import {UESR_LOGIN, VALID_CODE, USER_LOGOUT, UPDATE_PWD} from '@/constant/url';

/**
 * @description: 登录
 * @param {object} data
 * @return: 
 */
export function login (data) {
  return request ({
    url: UESR_LOGIN,
    method: 'post',
    data,
  });
}

/**
 * @description: 退出登录
 * @param {object} data
 * @return: 
 */
export function logout () {
  return request ({
    url: USER_LOGOUT,
    method: 'post',
  });
}

/**
 * @description: 修改密码
 * @param {object} data
 * @return: 
 */
export function updatePwd (data) {
  return request ({
    url: UPDATE_PWD,
    method: 'post',
    data,
  });
}

/**
 * @description: 获取验证码
 * @param {object} data
 * @return: 
 */
export function getValidCode () {
  return request ({
    url: VALID_CODE,
    method: 'post',
  });
}
