export function formatTime (time) {
  console.log ('time', time);
  if (time && time.includes (':')) {
    return time.split (' ')[0];
  }
  return '无';
}

export function convertCityName (obj) {
  return `${obj.province}-${obj.city}`;
}
