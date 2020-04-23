<template>
  <div id="container"></div>
</template>
<script>
import { styleJson } from "@/utils/map_config.js";
import BMap from "BMap";
export default {
  name: "BaiduMap",
  mounted() {
    var map = new BMap.Map("container"); // 创建地图实例
    var point = new BMap.Point(116.404, 39.915); // 创建点坐标
    map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    map.setMapStyleV2({ styleJson: styleJson });
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