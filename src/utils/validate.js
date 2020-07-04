/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @description: 验证账号 (字母或数字)
 * @param {Object} obj
 * @returns {Boolean}
 */
export function validUsername(account) {
  if (account.length < 5 || account.length > 12) {
    return '账号长度5-12个字符';
  }
  return /^[0-9a-zA-Z]*$/.test(account) ? '' : '账号只能包含数字或字母';
}

/**
 * @description: 验证手机号码
 * @param {string} phone
 * @returns {Boolean}
 */
export function validPhoneNumber(phone) {
  return /^1(3|4|5|6|7|8|9)\d{9}$/.test(phone);
}

/**
 * @description: 验证仅含字母
 * @param {string} str
 * @returns {Boolean}
 */
export function validString(str) {
  return /^[A-Za-z]+$/.test(str);
}

/**
 * @description: 验证仅含数字
 * @param {string} str
 * @returns {Boolean}
 */
export function validNumber(str) {
  return /^[0-9]+$/.test(str);
}

/**
 * @description: 验证正整数
 * @param {number} num
 * @returns {Boolean}
 */
export function validPositiveNum(num) {
  return /(^[1-9]\d*$)/.test(num);
}
