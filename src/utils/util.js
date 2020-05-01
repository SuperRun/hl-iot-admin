/**
 * 精确小数点7位
 * @param {number} num 
 */
export function keep7Num (num) {
  return num.toFixed (7);
}

/**
 * 生成随机文件名称
 * 规则八位随机字符，加下划线连接时间戳
 */
export function getFileNameUUID () {
  function rx () {
    return (((1 + Math.random ()) * 0x10000) | 0).toString (16).substring (1);
  }
  return `${+new Date ()}_${rx ()}${rx ()}`;
}
