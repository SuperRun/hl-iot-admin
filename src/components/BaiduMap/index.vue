<template>
  <div id="container"></div>
</template>
<script>
import { mapGetters } from "vuex";
import { styleJson } from "@/utils/map_config.js";
import BMap from "BMap";
import mark from "@/utils/map-marker.js";

export default {
  name: "BaiduMap",
  data() {
    return {
      curProject: {},
      map: {},
      deviceList: [],
      deviceMapList: []
    };
  },
  mounted() {
    console.log("map mounted", this.cur_proj);
    this.configMap();
  },
  computed: {
    ...mapGetters(["cur_proj"])
  },
  watch: {
    cur_proj() {
      this.configMap();
    }
  },
  methods: {
    async configMap() {
      // 获取项目详情
      console.log("cur_proj", this.cur_proj);
      const { longitude, latitude } = await this.$store.dispatch(
        "project/detailProject",
        {
          id: this.cur_proj
        }
      );
      // 获取设备列表
      const { list } = await this.$store.dispatch("device/listDevice", {
        project_id: this.cur_proj
      });
      this.deviceList = list;
      this.converDeviceList();
      this.initMap(longitude, latitude);
    },
    initMap(longitude, latitude) {
      if (Object.keys(this.map).length == 0) {
        this.map = new BMap.Map("container"); // 创建地图实例
        this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      }
      var point = new BMap.Point(longitude, latitude); // 创建点坐标
      this.map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
      this.map.setMapStyleV2({ styleJson: styleJson });

      this.deviceMapList.forEach(device => {
        let point = new BMap.Point(device.longitude, device.latitude);
        let myIcon = new BMap.Icon(device.icon, new BMap.Size(30, 30));
        let marker = new BMap.Marker(point, { icon: myIcon });
        this.map.addOverlay(marker);
      });
    },
    converDeviceList() {
      // - 类型 1-摄像头,2-led屏,3-照明灯,4-气象站
      // - 状态 1-待检测 2-正常,3-故障,4-离线
      const typeMap = new Map([
        [1, "camera"],
        [2, "screen"],
        [3, "light"],
        [4, "weather"]
      ]);
      const statusMap = new Map([
        [1, "Selected"],
        [2, "Normal"],
        [3, "Fault"],
        [4, "Offline"]
      ]);
      this.deviceMapList = this.deviceList.reduce((pre, cur) => {
        if (cur.status != 1) {
          pre.push({
            ...cur,
            icon:
              mark[
                `${typeMap.get(cur.project_type)}${statusMap.get(cur.status)}`
              ]
          });
        }
        return pre;
      }, []);
      console.log("deviceMapList", this.deviceMapList);
    }
  }
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
  height: 100%;
}
</style>