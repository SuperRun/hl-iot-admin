import BMap from 'BMap';
export default class Map {
  constructor (
    id,
    point = {},
    isEnableScrollWheelZoom = false,
    isAddScaleControl = false
  ) {
    this.ZOOM = 15;
    this.map = new BMap.Map (id);
    this.marks = [];
    // 中心点
    if (Object.keys (point).length != 0) {
      this.point = this.createPoint (point.lng, point.lat);
      this.setPoint (this.point, this.ZOOM);
    }
    // 比例尺控件
    if (isAddScaleControl) {
      this.ScaleControl = this.createScaleControl ();
      this.map.addControl (this.ScaleControl);
    }
    this.map.enableScrollWheelZoom (isEnableScrollWheelZoom);
  }

  // 创建中心点
  createPoint (lng, lat) {
    return new BMap.Point (lng, lat);
  }

  // 设置中心点
  setPoint (point, zoom = 15) {
    this.map.centerAndZoom (point, zoom);
  }

  // 添加mark isSingle true 表示地图只能有一个mark
  addMark (lng, lat, icon = {}, isSingle) {
    if (isSingle) {
      console.log ('清除标记');
      this.map.clearOverlays ();
      this.marks = [];
    }
    const point = this.createPoint (lng, lat);
    const zoom = this.map.getZoom () < 15 ? 15 : this.map.getZoom ();
    this.map.centerAndZoom (point, zoom);
    let myIcon = null;
    let marker = null;
    if (Object.keys (icon).length !== 0) {
      myIcon = new BMap.Icon (icon.url, new BMap.Size (icon.h, icon.w));
      marker = new BMap.Marker (point, {icon: myIcon});
    } else {
      marker = new BMap.Marker (point);
    }
    this.marks.push (marker);
    this.map.addOverlay (marker);
  }

  enableMarksDragging () {
    this.marks.forEach (mark => mark.enableDragging ());
  }

  disableMarksDragging () {
    this.marks.forEach (mark => mark.disableDragging ());
  }

  removeAllMarkers () {
    this.marks = [];
    this.map.clearOverlays;
  }

  // 创建比例尺
  createScaleControl () {
    return new BMap.ScaleControl ({
      anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
    });
  }

  // 给地图添加事件
  addMapEvent (type, fn) {
    this.map.addEventListener (type, fn);
  }

  // 根据城市名设置中心点
  setCenterByCity (city) {
    this.map.centerAndZoom (city, this.ZOOM);
  }

  // 缩放复原
  reset () {
    this.map.reset ();
  }
}
