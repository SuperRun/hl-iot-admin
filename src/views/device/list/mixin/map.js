import BaiduMap from '@/utils/map-util';
import MapMark from '@/utils/map-marker';
import { keep7Num } from '@/utils/util';
import { showSuccessMsg } from '@/utils/message';

export default {
  data() {
    return {
      deviceList: [],
      isLock: true,
    };
  },
  async mounted() {
    // 设备列表地图
    this.$store
      .dispatch('project/detailProject', { id: this.cur_proj })
      .then((res) => {
        this.deviceMap = new BaiduMap(
          'device-map',
          { lng: res.longitude, lat: res.latitude },
          true,
          true,
        );
      });

    let params = {
      product_type: this.params.product_type,
      project_id: this.cur_proj,
    };
    if (this.isWeather) {
      params['is_weather'] = 1;
    }

    const { list } = await this.listDevice(params);
    this.deviceList = list;
  },
  methods: {
    switchTableOrMap() {
      this.tableOrMap = 'map';
      this.deviceList.forEach((data) => {
        const vm = this;
        if (data.status != 1) {
          let iconPath = !this.isWeather
            ? MapMark[
                `${MapMark.deviceType[data.product_type - 1]}${
                  MapMark.state[data.status - 2]
                }`
              ]
            : MapMark[
                `${MapMark.deviceType[4 - 1]}${MapMark.state[data.status - 2]}`
              ];
          const icon = {
            url: iconPath,
            w: 30,
            h: 30,
          };
          const deviceData = {
            ...data,
            content: `<div>设备编号：${
              data.device_number != null ? data.device_number : '无'
            }</div>
                      <div>设备位号：${
                        data.place_number != null ? data.place_number : '无'
                      }</div>
                      <div>产品名称：${this.deviceType(data.product_type)}</div>
                      <div>产品型号：${
                        data.product && data.product.model != null
                          ? data.product.model
                          : '无'
                      }</div>`,
            opts: {
              width: 250, // 信息窗口宽度
              height: 100, // 信息窗口高度
              title: '基本信息', // 信息窗口标题
              enableMessage: true, //设置允许信息窗发送短息
            },
          };
          const clickFunc = (e) => {
            if (this.isWeather) {
              this.detailDevice({ id: data.id }).then((res) => {
                this.$store.commit('app/SET_DEVICE_DETAIL', res);
                this.$store.commit('app/OPEN_WEATHERDIALOG');
              });
            } else {
              this.detailDevice({ id: data.id }).then((res) => {
                this.$store.commit('app/SET_DEVICE_DETAIL', res);
                this.$store.commit('app/OPEN_DEVICEDIALOG');
              });
            }
          };
          const dragendFunc = function(point) {
            return new Promise((resolve, reject) => {
              vm.editDeviceLocation({
                id: data.id,
                longitude: keep7Num(point.lng),
                latitude: keep7Num(point.lat),
              }).then(
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
          this.deviceMap.addMark(
            data.longitude,
            data.latitude,
            icon,
            false,
            true,
            deviceData,
            clickFunc,
            dragendFunc,
          );
        }
      });
    },
    lock() {
      this.isLock = !this.isLock;
      this.isLock
        ? this.deviceMap.disableMarksDragging()
        : this.deviceMap.enableMarksDragging();
    },
    deviceType(type) {
      const map = new Map([
        [1, '摄像头'],
        [2, 'LED屏'],
        [3, '照明灯'],
        [4, '气象站'],
        [5, '物联网关'],
      ]);
      return map.get(type);
    },
  },
};
