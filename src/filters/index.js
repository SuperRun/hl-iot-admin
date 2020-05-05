export function formatTime (time) {
  if (time && time.includes (':')) {
    return time.split (' ')[0];
  }
  return '无';
}

export function convertCityName (obj) {
  return `${obj.province}-${obj.city}`;
}

// 状态1-待检测 2-正常,3-故障,4-离线
export function faultStatus (status) {
  const map = new Map ([[1, '待检测'], [2, '正常'], [3, '故障'], [4, '离线']]);
  return map.get (status);
}
// 类型 1-摄像头,2-led屏,3-照明灯,4-气象站,5-网关
export function deviceType (type) {
  const map = new Map ([
    [1, '摄像头'],
    [2, 'LED屏'],
    [3, '照明灯'],
    [4, '气象站'],
    [5, '物联网关'],
  ]);
  return map.get (type);
}
