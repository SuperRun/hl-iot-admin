<template>
  <baidu-map
    class="map"
    :center="center"
    :zoom="15"
    :scroll-wheel-zoom="true"
    ak="FsomoC3uOwyN279KoYEiIGDPiGbXhs4Z"
  >
    <bm-marker
      v-for="(item,index) in markers"
      :key="index"
      :position="item.position"
      :dragging="item.dragging"
      :icon="item.icon"
      data-marker="item.id"
      @mouseover="openWin(index)"
    ></bm-marker>
    <bm-info-window
      :key="item.id"
      v-for="item in infoWins"
      :position="item.position"
      :title="item.title"
      :show="item.show"
    >
      <div>设备编号：{{item.device.device_number}}</div>
      <div>设备位号：{{item.device.place_number}}</div>
      <div>产品名称：{{item.device.product_type}}</div>
      <div>产品型号：{{item.device.model}}</div>
    </bm-info-window>
  </baidu-map>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue';
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow.vue';
import { mapGetters, createNamespacedHelpers } from 'vuex';
import MapMark from '@/utils/map-marker';

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
  components: {
    BaiduMap,
    BmMarker,
    BmInfoWindow,
  },
  data() {
    return {
      center: {
        lng: '',
        lat: '',
      },
      zoom: 3,
      markers: [],
      infoWins: [],
      indexArr: [0, 0, 0, 0],
    };
  },
  computed: {
    ...mapGetters(['cur_proj']),
  },
  mounted() {
    this.configMap();
  },
  methods: {
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
      this.center = {
        lng: longitude,
        lat: latitude,
      };

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
            return item.is_weather == 1;
          } else {
            return true;
          }
        });
      } else {
        this.deviceList = list;
      }
      this.converDeviceList();
      this.convertInfoWins();
    },
    convertInfoWins() {
      console.log('convertInfoWins');
      this.deviceList.forEach((item, index) => {
        const device = {
          device_number: item.device_number != null ? item.device_number : '无',
          place_number: item.place_number != null ? item.place_number : '无',
          product_type: this.deviceType(item.product_type),
          model:
            item.product && item.product.model != null
              ? item.product.model
              : '无',
        };
        this.infoWins.push({
          id: item.id,
          show: false,
          device,
          position: {
            lng: item.longitude,
            lat: item.latitude,
          },
          width: 250, // 信息窗口宽度
          height: 100, // 信息窗口高度
          title: '基本信息',
        });
      });
      console.log('this.infoWins', this.infoWins);
    },
    deviceType(type) {
      const map = new Map([
        [1, '摄像头'],
        [2, 'LED屏'],
        [3, '照明灯'],
        [4, '气象站'],
      ]);
      return map.get(type);
    },
    converDeviceList() {
      const self = this;
      this.markers = this.deviceList.reduce((pre, cur) => {
        if (cur.status != 1) {
          let icon = '';
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
          let size = { width: 0, height: 0 };
          switch (cur.product_type) {
            case 1:
              size = { width: 10, height: 10 };
              break;
            case 2:
              if (cur.is_weather == 1 && this.types.includes(4)) {
                size = { width: 11, height: 17 };
              } else {
                size = { width: 11, height: 16 };
              }
              break;
            case 3:
              size = { width: 40, height: 80 };
              break;
            default:
              break;
          }
          pre.push({
            ...cur,
            position: {
              lng: cur.longitude,
              lat: cur.latitude,
            },
            dragging: false,
            icon: {
              url: MapMark[icon],
              size,
            },
          });
        }
        return pre;
      }, []);
      // 获取默认设备的索引号
      this.markers.forEach((device, index) => {
        const findIndex = this.defaultSelects.findIndex(
          (item) => item == device.id,
        );
        if (findIndex != -1) {
          this.indexArr[findIndex] = index;
        }
      });
    },
    openWin(index) {
      console.log('index', index);
      console.log('type', this.infoWins[index]);
      this.$set(this.infoWins[index], 'show', true);
    },
  },
};
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>