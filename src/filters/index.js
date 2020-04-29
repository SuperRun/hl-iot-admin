export function formatTime (time) {
  console.log ('time', time);
  if (time && time.includes (':')) {
    return time.split (' ')[0];
  }
  return time;
}
