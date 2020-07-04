import BMap from 'BMap';
import _ from 'lodash';
export default class BaiduMap {
  constructor(
    id,
    point = {},
    isEnableScrollWheelZoom = false,
    isAddScaleControl = false,
  ) {
    this.ZOOM = 15;
    // , {enableMapClick: false}
    this.map = new BMap.Map(id, {enableMapClick: false});
    this.marks = [];
    // 中心点
    if (Object.keys(point).length != 0) {
      this.point = this.createPoint(point.lng, point.lat);
      this.setPoint(this.point, this.ZOOM);
    }
    // 比例尺控件
    if (isAddScaleControl) {
      this.ScaleControl = this.createScaleControl();
      this.map.addControl(this.ScaleControl);
    }
    this.map.enableScrollWheelZoom(isEnableScrollWheelZoom);
  }

  // 创建中心点
  createPoint(lng, lat) {
    return new BMap.Point(lng, lat);
  }

  // 设置中心点
  setPoint(point, zoom = 15) {
    this.map.centerAndZoom(point, zoom);
  }

  // 添加mark isSingle true 表示地图只能有一个mark
  addMark(
    lng, // 经度
    lat, // 纬度
    icon = {}, // 标记图标
    isSingle = false, // 一张地图是否需要单个标记
    ifNeedInfoWindow = false, // 是否需要信息弹出框
    deviceData = {}, // 设备数据
    clickFunc, // 点击事件回调函数
    dragendFunc, // 标记拖动结束回调
  ) {
    if (isSingle) {
      this.map.clearOverlays();
      this.marks = [];
    }

    const _point = this.createPoint(lng, lat);
    const zoom = this.map.getZoom() < 15 ? 15 : this.map.getZoom();
    this.map.centerAndZoom(_point, zoom);
    let myIcon = null;
    let marker = null;
    const thisMap = this;

    if (Object.keys(icon).length !== 0) {
      myIcon = new BMap.Icon(icon.url, new BMap.Size(icon.h, icon.w));
      marker = new BMap.Marker(_point, {icon: myIcon});
    } else {
      marker = new BMap.Marker(_point);
    }

    const addInfoWinFunc = function(_point) {
      return _.debounce(function() {
        thisMap.map.openInfoWindow(
          new BMap.InfoWindow(deviceData.content, deviceData.opts),
          _point,
        );
      }, 500);
    };

    if (ifNeedInfoWindow) {
      marker.addEventListener('mouseover', addInfoWinFunc(_point));
      // marker.addEventListener(
      //   'mouseout',
      //   _.debounce(function() {
      //     console.log('mouseout');
      //     thisMap.map.closeInfoWindow();
      //   }, 800),
      // );
      marker.addEventListener('click', clickFunc);

      marker.addEventListener('dragstart', function() {
        this.map.closeInfoWindow();
      });

      marker.addEventListener(
        'dragend',
        _.debounce(function({type, target, pixel, point}) {
          console.log('point', point);
          dragendFunc(point).then((_) => {
            marker.removeEventListener('mouseover', addInfoWinFunc(_point));
            marker.addEventListener('mouseover', addInfoWinFunc(point));
          });
        }, 500),
      );
    }

    this.marks.push(marker);
    this.map.addOverlay(marker);
  }

  enableMarksDragging() {
    this.marks.forEach((mark) => mark.enableDragging());
  }

  disableMarksDragging() {
    this.marks.forEach((mark) => mark.disableDragging());
  }

  removeAllMarkers() {
    this.marks = [];
    this.map.clearOverlays;
  }

  // 创建比例尺
  createScaleControl() {
    return new BMap.ScaleControl({
      anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
    });
  }

  // 给地图添加事件
  addMapEvent(type, fn) {
    this.map.addEventListener(type, fn);
  }

  // 根据城市名设置中心点
  setCenterByCity(city) {
    this.map.centerAndZoom(city, this.ZOOM);
  }

  // 缩放复原
  reset() {
    this.map.reset();
  }

  // 信息窗口
  createInfoWindow(content, opts) {
    return new BMap.InfoWindow(content, opts);
  }

  openInfoWindow(infoWindow, point) {
    this.map.openInfoWindow(infoWindow, point);
  }
}
