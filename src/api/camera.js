import axios from 'axios';

// 语音文件列表接口
export function getAudioFile(params) {
  return axios.request({
    url: 'https://open.ys7.com/api/route/voice/v3/devices/voices',
    method: 'get',
    params,
  });
}

// 语音文件查询接口
export function queryAudioFile(data) {
  return axios.request({
    url: 'https://open.ys7.com/api/lapp/voice/query',
    method: 'post',
    data,
  });
}

// 语音文件上传接口
export function uploadAudioFile(data) {
  return axios.request({
    url: 'https://open.ys7.com/api/route/voice/v3/devices/voices',
    method: 'post',
    data,
  });
}

// 删除语音文件接口
export function delAudioFile(data) {
  return axios.request({
    url: 'https://open.ys7.com/api/lapp/voice/delete',
    method: 'post',
    data,
  });
}
