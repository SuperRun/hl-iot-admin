let oss = require ('ali-oss');

export function client (data) {
  return oss ({
    accessKeyId: data.accessid,
    accessKeySecret: data.policy,
    bucket: data.dir,
    region: 'oss-cn-beijing',
  });
}

/**
 * 生成随机文件名称
 * 规则八位随机字符，加下划线连接时间戳
 */
export const getFileNameUUID = () => {
  function rx () {
    return (((1 + Math.random ()) * 0x10000) | 0).toString (16).substring (1);
  }
  return `${+new Date ()}_${rx ()}${rx ()}`;
};
