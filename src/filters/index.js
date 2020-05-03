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
