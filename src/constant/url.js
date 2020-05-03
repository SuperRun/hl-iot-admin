const BASE_API = process.env.NODE_ENV == 'development' ? 'map' : '';
const ak = 'WGoBmL91XStsCQ7PKBOU8Vi1UFt6qWLC';
const PLACE_QUERY = `${BASE_API}/place/v2/suggestion?ak=${ak}&output=json`;
const PLACE_QUERY_DETAIl = `${BASE_API}/place/v2/detail?ak=${ak}&output=json`;

// user
const UESR_LOGIN = '/common/login';
const VALID_CODE = '/common/getCaptcha';
const USER_LOGOUT = '/user/logout';
const UPDATE_PWD = '/user/updatePassword';
const USER_LIST = '/user/index';
const USER_ADD = '/user/store';
const USER_EDIT = '/user/update';
const USER_DEL = '/user/destroy';

// role
const ROLE_LIST = '/role/index';
const ROLE_EDIT = '/role/update';
const ROLE_ADD = '/role/store';
const ROLE_DETAIL = '/role/detail';

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
const DEVICE_ADD = '/device/store';
const DEVICE_LIST = '/device/index';
const DEVICE_DESTROY = '/device/destroy';
const DEVICE_DETAIL = '/device/detail';

// upload
const UPLOAD_IMAGE = '/oss/image_upload';
const UPLOAD_VIDEO = '/oss/video_upload';

// group
const GROUP_LIST = '/group/index';
const GROUP_EDIT = '/group/update';
const GROUP_ADD = '/group/store';
const GROUP_DETAIL = '/group/detail';

export {
  PLACE_QUERY,
  PLACE_QUERY_DETAIl,
  UESR_LOGIN,
  VALID_CODE,
  USER_LOGOUT,
  UPDATE_PWD,
  USER_LIST,
  USER_ADD,
  USER_DEL,
  USER_EDIT,
  ROLE_LIST,
  ROLE_ADD,
  ROLE_EDIT,
  ROLE_DETAIL,
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
  DEVICE_ADD,
  DEVICE_LIST,
  DEVICE_DESTROY,
  DEVICE_DETAIL,
  UPLOAD_IMAGE,
  UPLOAD_VIDEO,
  GROUP_LIST,
  GROUP_ADD,
  GROUP_EDIT,
  GROUP_DETAIL,
};
