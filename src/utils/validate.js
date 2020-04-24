/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test (path);
}

/**
 * @description: 验证账号 (字母或数字)
 * @param {Object} obj
 * @returns {Boolean}
 */
export function validAccount (account) {
  if (account.length < 5 || account.length > 12) {
    return '账号长度5-12个字符';
  }
  return /^[0-9a-zA-Z]*$/.test (account) ? '' : '账号只能包含数字或字母';
}

/**
 * @description: 验证手机号码
 * @param {string} phone
 * @returns {Boolean}
 */
export function validPhoneNumber (phone) {
  return /^1(3|4|5|6|7|8|9)\d{9}$/.test (phone);
}
