import lightNormal from '@/assets/images/light-normal.png';
import lightClosed from '@/assets/images/light-closed.png';
import lightOffline from '@/assets/images/light-offline.png';
import lightSelected from '@/assets/images/light-selected.png';
import lightFault from '@/assets/images/light-fault.png';
import cameraNormal from '@/assets/images/camera-normal.png';
import cameraOffline from '@/assets/images/camera-offline.png';
import cameraSelected from '@/assets/images/camera-selected.png';
import screenNormal from '@/assets/images/screen-normal.png';
import screenOffline from '@/assets/images/screen-offline.png';
import screenSelected from '@/assets/images/screen-selected.png';
import screenClosed from '@/assets/images/screen-closed.png';
import weatherNormal from '@/assets/images/weather-normal.png';
import weatherOffline from '@/assets/images/weather-offline.png';
import weatherSelected from '@/assets/images/weather-selected.png';
import weather1 from '@/assets/images/weather1.png';
import weather2 from '@/assets/images/weather2.png';
import weather3 from '@/assets/images/weather3.png';
import weather4 from '@/assets/images/weather4.png';

const deviceType = ['camera', 'screen', 'light', 'weather'];
// 状态1-待检测 2-正常,3-故障,4-离线
const state = ['Normal', 'Fault', 'Offline'];

const marks = {
  cameraSelected,
  cameraNormal,
  cameraOffline,
  screenSelected,
  screenOffline,
  screenNormal,
  screenClosed,
  lightSelected,
  lightNormal,
  lightFault,
  lightOffline,
  lightClosed,
  weatherSelected,
  weatherNormal,
  weatherOffline,
  weather1,
  weather2,
  weather3,
  weather4,
};

export default {
  ...marks,
  deviceType,
  state,
};
