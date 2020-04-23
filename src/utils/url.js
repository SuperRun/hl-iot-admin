// const BASE_URL = 'http://api.map.baidu.com';
const BASE_API = '/map';
const ak = 'WGoBmL91XStsCQ7PKBOU8Vi1UFt6qWLC';
const PLACE_QUERY = `${BASE_API}/place/v2/suggestion?ak=${ak}&output=json`;
const PLACE_QUERY_DETAIl = `${BASE_API}/place/v2/detail?ak=${ak}&output=json`;

export {PLACE_QUERY, PLACE_QUERY_DETAIl};
