<template>
  <div id="container"></div>
</template>
<script>
import { mapGetters, createNamespacedHelpers } from 'vuex';
// import {styleJson} from '@/utils/map_config.js';
import BMap from 'BMap';
import MapMark from '@/utils/map-marker';
import _ from 'lodash';
import { keep7Num } from '@/utils/util';
import { showSuccessMsg } from '@/utils/message';
const { mapActions } = createNamespacedHelpers('device');
import { getLedWeatherData } from '@/api/device';

// - 类型 1-摄像头,2-led屏,3-照明灯,4-气象站
// - 状态 1-待检测 2-正常,3-故障,4-离线
const typeMap = new Map([
  [1, 'camera'],
  [2, 'screen'],
  [3, 'light'],
  [4, 'weather'],
]);
const statusMap = new Map([
  [1, 'Selected'],
  [2, 'Normal'],
  [3, 'Fault'],
  [4, 'Offline'],
]);
export default {
  name: 'BaiduMap',
  props: {
    defaultSelects: {
      type: Array,
      default: () => [],
    },
    isLock: {
      type: Boolean,
      default: true,
    },
    types: {
      type: Array,
      default: () => [],
    },
    selectedDevice: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      curProject: {},
      map: {},
      deviceList: [],
      deviceMapList: [],
      selectedIndex: 0,
      selects: [],
      markers: [],
      indexArr: [0, 0, 0, 0],
    };
  },
  mounted() {
    this.configMap();
  },
  computed: {
    ...mapGetters(['cur_proj']),
  },
  watch: {
    cur_proj() {
      this.configMap();
    },
    isLock(newVal) {
      if (newVal) {
        this.markers.forEach((item, index) => item.marker.disableDragging());
      } else {
        this.markers.forEach((item, index) => item.marker.enableDragging());

        // this.markers.forEach((marker, index) =>
        //   this.deviceMapList[index].product_type != 4
        //     ? marker.enableDragging()
        //     : '',
        // );
      }
    },
    types: {
      handler: function (val, oldVal) {
        this.configMap();
      },
      deep: true,
    },
    selectedDevice(val, oldVal) {
      const self = this;
      if (val != '') {
        const index = self.markers.findIndex(
          (item) => item.device_number == val,
        );
        const curType = self.markers[index].product_type;
        let indexVal;
        let iconSize = null;
        let isWeather = self.markers[index].is_weather;
        if (curType == 2 && isWeather == 1) {
          indexVal = self.indexArr[3];
        } else {
          indexVal = self.indexArr[curType - 1];
        }

        switch (curType) {
          case 1:
            iconSize = new BMap.Size(10, 10);
            break;
          case 2:
            if (isWeather == 1 && this.types.includes(4)) {
              iconSize = new BMap.Size(11, 17);
            } else if (isWeather == 2) {
              iconSize = new BMap.Size(11, 16);
            }
            break;
          case 3:
            iconSize = new BMap.Size(40, 80);
            break;
          default:
            break;
        }

        self.indexArr[curType - 1] = index;
        let temp1 = self.deviceMapList[indexVal].product_type;
        let temp2 = self.deviceMapList[index].product_type;
        if (temp1 == 2 && self.deviceMapList[indexVal].is_weather == 1) {
          temp1 = 4;
        }
        if (temp2 == 2 && self.deviceMapList[index].is_weather == 1) {
          temp2 = 4;
        }
        if (indexVal != 0) {
          if ((temp1 == 4 && temp2 != 4) || (temp1 != 4 && temp2 == 4)) {
            self.markers[index].marker.setIcon(
              new BMap.Icon(MapMark[`${typeMap.get(temp2)}Selected`], iconSize),
            );
          } else {
            self.markers[indexVal].marker.setIcon(
              new BMap.Icon(
                MapMark[
                  `${typeMap.get(temp1)}${statusMap.get(
                    self.deviceMapList[indexVal].status,
                  )}`
                ],
                iconSize,
              ),
            );

            self.markers[index].marker.setIcon(
              new BMap.Icon(MapMark[`${typeMap.get(temp2)}Selected`], iconSize),
            );
          }
        }

        self.detailDevice({ id: self.deviceMapList[index].id }).then((res) => {
          self.$emit('setDefaultDetail', {
            varName: `${typeMap.get(temp2)}Detail`,
            data: res,
          });
          if (temp2 == 4) {
            self.$store.commit('app/SET_DEVICE_DETAIL', res);
            self.$store.commit('app/OPEN_WEATHERDIALOG');
          } else {
            self.$store.commit('app/SET_DEVICE_DETAIL', res);
            self.$store.commit('app/OPEN_DEVICEDIALOG');
          }
        });
      }
    },
  },
  methods: {
    ...mapActions(['detailDevice', 'editDeviceLocation']),
    async configMap() {
      // 获取项目详情
      if (!this.cur_proj) {
        return;
      }
      const { longitude, latitude } = await this.$store.dispatch(
        'project/detailProject',
        {
          id: this.cur_proj,
        },
      );
      // 获取设备列表
      let typesCopy = [];
      if (this.types.includes(4) && !this.types.includes(2)) {
        typesCopy = [...this.types];
        typesCopy[this.types.findIndex((type) => type == 4)] = 2;
      } else {
        typesCopy = [...this.types];
      }
      let params = {
        project_id: this.cur_proj,
        product_type_list: typesCopy.join(','),
      };

      const { list } = await this.$store.dispatch('device/listDevice', params);

      if (this.types.includes(4) && !this.types.includes(2)) {
        this.deviceList = list.filter((item) => {
          if (item.product_type == 2) {
            if (item.is_weather == 1) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        });
      } else {
        this.deviceList = list;
      }
      this.converDeviceList();
      this.initMap(longitude, latitude);
    },
    initMap(longitude, latitude) {
      // if (Object.keys(this.map).length == 0) {
      //   console.log('map');
      this.map = new BMap.Map('container', { enableMapClick: false }); // 创建地图实例
      this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      // }
      this.map.clearOverlays();
      var point = new BMap.Point(longitude, latitude); // 创建点坐标
      this.map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
      this.addMarkers();
      // this.map.clearOverlays();
    },
    converDeviceList() {
      const self = this;
      this.deviceMapList = this.deviceList.reduce((pre, cur) => {
        if (cur.status != 1) {
          let icon = '';
          if (cur.status == 1) {
            return pre;
          }
          if (cur.product_type == 3) {
            if (self.defaultSelects.includes(cur.id)) {
              icon = 'lightSelected';
            } else {
              if (cur.status == 2) {
                icon = cur.is_open == 1 ? 'lightNormal' : 'lightClosed';
              } else if (cur.status == 3) {
                icon = 'lightFault';
              } else if (cur.status == 4) {
                icon = 'lightOffline';
              }
            }
          } else if (cur.product_type == 2) {
            if (cur.is_weather == 1 && self.types.includes(4)) {
              if (self.defaultSelects.includes(cur.id)) {
                icon = `${typeMap.get(4)}Selected`;
              } else {
                icon = `${typeMap.get(4)}${statusMap.get(cur.status)}`;
              }
            } else if (self.types.includes(2)) {
              if (self.defaultSelects.includes(cur.id)) {
                icon = `${typeMap.get(2)}Selected`;
              } else {
                if (cur.status == 2) {
                  icon = cur.is_open == 1 ? 'screenNormal' : 'screenClosed';
                } else if (cur.status == 4) {
                  icon = 'screenOffline';
                }
              }
            }
          } else if (self.defaultSelects.includes(cur.id)) {
            icon = `${typeMap.get(cur.product_type)}Selected`;
          } else {
            icon = `${typeMap.get(cur.product_type)}${statusMap.get(
              cur.status,
            )}`;
          }
          pre.push({
            ...cur,
            icon: MapMark[icon],
          });
        }
        return pre;
      }, []);
      // 获取默认设备的索引号
      this.deviceMapList.forEach((device, index) => {
        const findIndex = this.defaultSelects.findIndex(
          (item) => item == device.id,
        );
        if (findIndex != -1) {
          this.indexArr[findIndex] = index;
        }
      });
    },
    addMarkers() {
      const self = this;
      this.markers = [];
    //  this.map.clearOverlays();
      this.deviceMapList.forEach((device, index) => {
        let point = new BMap.Point(device.longitude, device.latitude);
        let iconSize = null;
        let isWeather = 1;
        if (device.product_type == 2) {
          isWeather = device.is_weather;
        }
        switch (device.product_type) {
          case 1:
            iconSize = new BMap.Size(10, 10);
            break;
          case 2:
            if (isWeather == 1 && this.types.includes(4)) {
              iconSize = new BMap.Size(11, 17);
            } else {
              iconSize = new BMap.Size(11, 16);
            }
            break;
          case 3:
            iconSize = new BMap.Size(40, 80);
            break;
          default:
             iconSize = new BMap.Size(16, 28);
            break;
        }
        let myIcon = new BMap.Icon(device.icon, iconSize);
        let marker = new BMap.Marker(point, { icon: myIcon });
        // let content=`<div>设备编号：${device.device_number != null ? device.device_number : '无'}</div><div>设备位号：${device.place_number != null ? device.place_number : '无'}</div><div>产品名称：${this.deviceType(device.product_type,)}</div><div>产品型号：${device.product && device.product.model != null? device.product.model: '无'}</div>`;
        // self.map.addOverlay(marker);
        //  this.addClickHandler(content,marker,point);
        // const deviceData = {
        //   content: `<div>设备编号：${
        //     device.device_number != null ? device.device_number : '无'
        //   }</div>
        //               <div>设备位号：${
        //                 device.place_number != null ? device.place_number : '无'
        //               }</div>
        //               <div>产品名称：${this.deviceType(
        //                 device.product_type,
        //               )}</div>
        //               <div>产品型号：${
        //                 device.product && device.product.model != null
        //                   ? device.product.model
        //                   : '无'
        //               }</div>`,
        //   opts: {
        //     width: 250, // 信息窗口宽度
        //     height: 100, // 信息窗口高度
        //     title: '基本信息', // 信息窗口标题
        //     enableMessage: true, //设置允许信息窗发送短息
        //   },
        // };
        // const win = new BMap.InfoWindow(deviceData.content, deviceData.opts);
          const opts = {
              width: 250, // 信息窗口宽度
              height: 100, // 信息窗口高度
              title: '基本信息', // 信息窗口标题
              enableMessage: true, //设置允许信息窗发送短息
          }
         const win = new BMap.InfoWindow(`<div>设备编号：${device.device_number != null ? device.device_number : '无'}</div><div>设备位号：${device.place_number != null ? device.place_number : '无'}</div><div>产品名称：${this.deviceType(device.product_type,)}</div><div>产品型号：${device.product && device.product.model != null? device.product.model: '无'}</div>`, opts); // 创建信息窗口对象 
       //self.map.openInfoWindow(win, point);
       
       win.disableAutoPan();
        const addInfoWinFunc = function (_point) {
          return _.debounce(function () {
            self.map.openInfoWindow(win, _point);
          }, 500);
        };

        // const closeInfoWinFunc = function () {
        //   return _.debounce(function () {
        //     console.log('close');
        //     self.map.closeInfoWindow();
        //   }, 500);
        // };

        const clickFunc = function (e) {
          let curType = self.markers[index].product_type;
          if (
            curType == 2 &&
            self.types.includes(4) &&
            self.markers[index].is_weather == 1
          ) {
            curType = 4;
          }

          const indexVal = self.indexArr[curType - 1];
          let temp1 = self.deviceMapList[indexVal].product_type;
          let temp2 = self.deviceMapList[index].product_type;
          if (
            temp1 == 2 &&
            self.deviceMapList[indexVal].is_weather == 1 &&
            self.types.includes(4)
          ) {
            temp1 = 4;
          }
          if (
            temp2 == 2 &&
            self.deviceMapList[index].is_weather == 1 &&
            self.types.includes(4)
          ) {
            temp2 = 4;
          }

          self.indexArr[curType - 1] = index;
          if ((temp1 == 4 && temp2 != 4) || (temp1 != 4 && temp2 == 4)) {
            self.markers[index].marker.setIcon(
              new BMap.Icon(MapMark[`${typeMap.get(temp2)}Selected`], iconSize),
            );
          } else {
            let icon = '';
            let cur = self.markers[indexVal];
            if (cur.product_type == 3) {
              if (cur.status == 2) {
                icon = cur.is_open == 1 ? 'lightNormal' : 'lightClosed';
              } else if (cur.status == 3) {
                icon = 'lightFault';
              } else if (cur.status == 4) {
                icon = 'lightOffline';
              }
            } else if (cur.product_type == 2) {
              if (cur.is_weather == 1 && self.types.includes(4)) {
                icon = `${typeMap.get(4)}${statusMap.get(cur.status)}`;
              } else if (self.types.includes(2)) {
                if (cur.status == 2) {
                  icon = cur.is_open == 1 ? 'screenNormal' : 'screenClosed';
                } else if (cur.status == 4) {
                  icon = 'screenOffline';
                }
              }
            } else {
              icon = `${typeMap.get(cur.product_type)}${statusMap.get(
                cur.status,
              )}`;
            }

            self.markers[indexVal].marker.setIcon(
              new BMap.Icon(MapMark[icon], iconSize),
            );
            self.markers[index].marker.setIcon(
              new BMap.Icon(MapMark[`${typeMap.get(temp2)}Selected`], iconSize),
            );
          }

          self.detailDevice({ id: device.id }).then((res1) => {
            if (temp2 == 4) {
              getLedWeatherData({ device_id: device.id }).then((res2) => {
                if (res2.data && res2.data.list && res2.data.list.length > 0) {
                  self.$emit('setDefaultDetail', {
                    varName: `${typeMap.get(temp2)}Detail`,
                    data: { ...res1, weatherInfo: res2.data.list[0] },
                  });
                } else {
                  self.$emit('setDefaultDetail', {
                    varName: `${typeMap.get(temp2)}Detail`,
                    data: { ...res1, weatherInfo: null },
                  });
                }
                self.$store.commit('app/SET_DEVICE_DETAIL', res1);
                self.$store.commit('app/OPEN_WEATHERDIALOG');
              });
            } else {
              self.$emit('setDefaultDetail', {
                varName: `${typeMap.get(temp2)}Detail`,
                data: res1,
              });
              self.$emit('showDetail');
              self.$store.commit('app/SET_DEVICE_DETAIL', res1);
              self.$store.commit('app/OPEN_DEVICEDIALOG');
            }
          });
        };

        const dragendFunc = function (point) {
          return new Promise((resolve, reject) => {
            self
              .editDeviceLocation({
                id: device.id,
                longitude: keep7Num(point.lng),
                latitude: keep7Num(point.lat),
              })
              .then(
                (res) => {
                  showSuccessMsg('成功更改定位!');
                  resolve();
                },
                (err) => {
                  reject(err.msg);
                },
              );
          });
        };

        // marker.addEventListener("mouseover", function () {
        //   this.map.openInfoWindow(win, point); //开启信息窗口
        // });
       marker.addEventListener('mouseover', addInfoWinFunc(point));
      // marker.addEventListener('mouseover',function(e){
      //    var p = e.target;
      //    var es = event || window.event;
      //   var left = es.screenX;
      //   var top = es.screenY;
       
      //    var points = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      //    self.map.openInfoWindow(win,points); //开启信息窗口
      // });
        //win.addEventListener('mouseout', closeInfoWinFunc());
        marker.addEventListener('click', clickFunc);
        // marker.addEventListener('click', function () {
        //   var infowindow = new BMap.InfoWindow("内容",{width:250,height:100,title:"hello"});
        //   self.map.openInfoWindow(infoWindow,self.map.getCenter());
        // //  that.map.openInfoWindow(win, map.getCenter()); //开启信息窗口
        // });
        marker.addEventListener('dragstart', function () {
          this.map.closeInfoWindow();
        });
        marker.addEventListener(
          'dragend',
          _.debounce(function ({ type, target, pixel, point }) {
            dragendFunc(point).then((_) => {
              marker.removeEventListener('mouseover', addInfoWinFunc(_point));
              marker.addEventListener('mouseover', addInfoWinFunc(point));
            });
          }, 500),
        );
        if (device.product_type != 3) {
          marker.setZIndex(1);
        }
        this.markers.push({ marker, ...device });
         this.map.addOverlay(marker);
      });
    },
    // addClickHandler(content,marker,point){
    //   let that=this;
		//   marker.addEventListener("mouseover",function(e){
		// 	  that.openInfo(content,e,point);
    //   });
    // },
    // openInfo(content,e,point){
    //   const opts = {
    //       width: 250, // 信息窗口宽度
    //       height: 100, // 信息窗口高度
    //       title: '基本信息', // 信息窗口标题
    //       enableMessage: true, //设置允许信息窗发送短息
    //   }
    //   this.map = new BMap.Map('container');
    //   var p = e.target;
    //   var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
    //   infoWindow.disableAutoPan();
    //   this.map.openInfoWindow(infoWindow,point); //开启信息窗口
    //   return false;
    // },
    deviceType(type) {
      const map = new Map([
        [1, '摄像头'],
        [2, 'LED屏'],
        [3, '照明灯'],
        [4, '气象站'],
      ]);
      return map.get(type);
    },
  },
};
</script>
<style>
.anchorBL {
  display: none;
}
</style>
<style lang="scss" scoped>
#container {
  width: 100%;
  height: 100vh;
}
</style>
