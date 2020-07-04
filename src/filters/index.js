export function formatTime(time) {
  if (time && time.includes(':')) {
    return time.split(' ')[0];
  }
  return '无';
}

export function convertCityName(obj) {
  return `${obj.province}-${obj.city}`;
}

// 状态1-待检测 2-正常,3-故障,4-离线
export function faultStatus(status) {
  const map = new Map([
    [1, '待检测'],
    [2, '正常'],
    [3, '故障'],
    [4, '离线'],
  ]);
  return status ? map.get(status) : '未知';
}
// 类型 1-摄像头,2-led屏,3-照明灯,4-气象站,5-网关
export function deviceType(type) {
  const map = new Map([
    [1, '摄像头'],
    [2, 'LED屏'],
    [3, '照明灯'],
    [4, '气象站'],
    [5, '物联网关'],
  ]);
  return map.get(type);
}

export function adminFilter(users) {
  return users.length != 0
    ? users.map((user) => user.user.username).join(', ')
    : '无';
}

export function timeFilter(time) {
  if (time < 10) {
    return '0' + time;
  }
  return time;
}

// 风向
export function directionFilter(direction) {
  // 正北：15， 东北偏北：0，东北：1， 东北偏东：2，
  // 正东：3，东南偏东：04，东南：05， 东南偏南：06，
  // 正南：07， 西南偏南：08，西南：09 ，西南偏西：10，
  // 正西：11， 西北偏西：12，西北：13，西北偏北：14'
  const map = new Map([
    ['15', '正北'],
    ['3', '正东'],
    ['7', '正南'],
    ['11', '正西'],
    ['0', '东北偏北'],
    ['4', '东南偏东'],
    ['8', '西南偏南'],
    ['12', '西北偏西'],
    ['1', '东北'],
    ['5', '东南'],
    ['9', '西南'],
    ['13', '西北'],
    ['2', '东北偏东'],
    ['6', '东南偏南'],
    ['10', '西南偏西'],
    ['14', '西北偏北'],
  ]);
  return map.get(direction);
}
