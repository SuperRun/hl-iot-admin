import request from '@/utils/request';
import {
  UESR_LOGIN,
  VALID_CODE,
  USER_LOGOUT,
  UPDATE_PWD,
  USER_LIST,
  USER_ADD,
  USER_EDIT,
  USER_DEL,
} from '@/constant/url';

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

/**
 * @description: 用户列表
 * @param {object} params
 * @return: 
 */
export function listUser (params) {
  return request ({
    url: USER_LIST,
    method: 'get',
    params,
  });
}

/**
 * @description: 添加用户
 * @param {object} data
 * @return: 
 */
export function addUser (data) {
  return request ({
    url: USER_ADD,
    method: 'post',
    data,
  });
}

/**
 * @description: 编辑用户
 * @param {object} data
 * @return: 
 */
export function editUser (data) {
  return request ({
    url: USER_EDIT,
    method: 'post',
    data,
  });
}

/**
 * @description: 删除用户
 * @param {object} data
 * @return: 
 */
export function delUser (data) {
  return request ({
    url: USER_DEL,
    method: 'post',
    data,
  });
}
