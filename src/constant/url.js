// const BASE_API = process.env.NODE_ENV == 'development' ? 'map' : '';
// const ak = 'WGoBmL91XStsCQ7PKBOU8Vi1UFt6qWLC';

// map
const PLACE_QUERY = '/map/place_remind';
const PLACE_QUERY_DETAIl = '/map/place_detail_search';

// user
const UESR_LOGIN = '/common/login';
const VALID_CODE = '/common/getCaptcha';
const USER_LOGOUT = '/user/logout';
const UPDATE_PWD = '/user/updatePassword';
const USER_LIST = '/user/index';
const USER_ADD = '/user/store';
const USER_EDIT = '/user/update';
const USER_DISABLE = '/user/disableUser';

// role
const ROLE_LIST = '/role/index';
const ROLE_EDIT = '/role/update';
const ROLE_ADD = '/role/store';
const ROLE_DETAIL = '/role/detail';

// auth
const AUTH_LIST = '/permission/index';
const AUTH_EDIT = '/permission/update';
const AUTH_ADD = '/permission/store';
const AUTH_DETAIL = '/permission/detail';
const AUTH_TREE = '/permission/menus_all';

// product
const PRODUCT_EDIT = '/product/update';
const PRODUCT_ADD = '/product/store';
const PRODUCT_LIST = '/product/index';
const PRODUCT_DESTROY = '/product/destroy';
const PRODUCT_DETAIL = '/product/detail';

// project
const PROJECT_EDIT = '/project/update';
const PROJECT_ADD = '/project/store';
const PROJECT_LIST = '/project/index';
const PROJECT_DESTROY = '/project/destroy';
const PROJECT_DETAIL = '/project/detail';

// device
const DEVICE_EDIT = '/device/update';
const DEVICE_EDIT_LOCATION = '/device/setLatLon';
const DEVICE_ADD = '/device/store';
const DEVICE_LIST = '/device/index';
const DEVICE_DESTROY = '/device/destroy';
const DEVICE_DETAIL = '/device/detail';
const DEVICE_COUNT = '/statistics/home';
const DEVICE_REFRESH = '/device/refresh';
const DEVICE_FIRST = '/statistics/home_group';

const LED_TURN = '/led/setScreenOpen';
const SET_LED_BRIGHTNESS = '/led/setBrightness';
const GET_LED_BRIGHTNESS = '/led/getBrightness';
const LED_OPEN_STATE = '/led/isScreenOpen';
const LED_UPLOAD = '/led/xixunPlayer';
const LED_UPLOAD_DETAIL = '/led/nowPlay';
const LED_CLEAR_FILE = '/led/clearPlayerTask';
const LIGHT_REFRESH = '/lamp/refresh';
const LED_RESTART = '/led/callCardService';
const LED_WEATHER = '/led/weather';

const CAMERA_DIRECTION = '/camera/yunStart';
const CAMERA_TOKEN = '/camera/getToken';

// fault
const WARN_LIST = '/warn/warnList';
const WARN_CLOSE = '/warn/closeWarn';

// upload
const UPLOAD_IMAGE = '/oss/image_upload';
const UPLOAD_VIDEO = '/oss/video_upload';

// group
const GROUP_LIST = '/group/index';
const GROUP_EDIT = '/group/update';
const GROUP_ADD = '/group/store';
const GROUP_DETAIL = '/group/detail';
const GROUP_DESTROY = '/group/destroy';
const GROUP_CONTROL_DETAIL = '/group/groupControlDetail';
const GROUP_CONTROL = '/lamp/groupControl';
const GROUP_DEVICE_LIST = '/group/groupDeviceList';
const GROUP_BRIGHTNESS = '/lamp/brightness';

// platform
const GET_SYSTEM = '/getSystem';
const SET_SYSTEM = '/setSystem';

export {
  PLACE_QUERY,
  PLACE_QUERY_DETAIl,
  UESR_LOGIN,
  VALID_CODE,
  USER_LOGOUT,
  UPDATE_PWD,
  USER_LIST,
  USER_ADD,
  USER_DISABLE,
  USER_EDIT,
  ROLE_LIST,
  ROLE_ADD,
  ROLE_EDIT,
  ROLE_DETAIL,
  AUTH_LIST,
  AUTH_ADD,
  AUTH_EDIT,
  AUTH_DETAIL,
  AUTH_TREE,
  PRODUCT_EDIT,
  PRODUCT_ADD,
  PRODUCT_LIST,
  PRODUCT_DESTROY,
  PRODUCT_DETAIL,
  PROJECT_EDIT,
  PROJECT_ADD,
  PROJECT_LIST,
  PROJECT_DESTROY,
  PROJECT_DETAIL,
  DEVICE_EDIT,
  DEVICE_EDIT_LOCATION,
  DEVICE_ADD,
  DEVICE_LIST,
  DEVICE_DESTROY,
  DEVICE_DETAIL,
  DEVICE_COUNT,
  DEVICE_REFRESH,
  DEVICE_FIRST,
  WARN_LIST,
  WARN_CLOSE,
  LED_TURN,
  LED_UPLOAD,
  LED_UPLOAD_DETAIL,
  LED_CLEAR_FILE,
  LIGHT_REFRESH,
  LED_RESTART,
  GET_LED_BRIGHTNESS,
  SET_LED_BRIGHTNESS,
  LED_OPEN_STATE,
  LED_WEATHER,
  CAMERA_DIRECTION,
  CAMERA_TOKEN,
  UPLOAD_IMAGE,
  UPLOAD_VIDEO,
  GROUP_LIST,
  GROUP_ADD,
  GROUP_EDIT,
  GROUP_DETAIL,
  GROUP_DESTROY,
  GROUP_CONTROL_DETAIL,
  GROUP_CONTROL,
  GROUP_DEVICE_LIST,
  GROUP_BRIGHTNESS,
  GET_SYSTEM,
  SET_SYSTEM,
};
