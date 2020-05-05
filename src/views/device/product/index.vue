<template>
  <div class="product-manage bg-white-3 min-h-1 bx-shadow-2">
    <ul class="flex">
      <li
        :class="['tab', currentTab=='CameraPanel'?'active':'']"
        @click="currentTab='CameraPanel'"
      >摄像头</li>
      <li
        :class="['tab', currentTab=='ScreenPanel'?'active':'']"
        @click="currentTab='ScreenPanel'"
      >LED屏</li>
      <li
        :class="['tab', currentTab=='LightPanel'?'active':'']"
        @click="currentTab='LightPanel'"
      >照明灯</li>
      <li
        :class="['tab', currentTab=='WeatherPanel'?'active':'']"
        @click="currentTab='WeatherPanel'"
      >气象站</li>
      <li
        :class="['tab', currentTab=='GatewayPanel'?'active':'']"
        @click="currentTab='GatewayPanel'"
      >物联网关</li>
    </ul>

    <div class="tab-panel">
      <component :is="currentTab"></component>
    </div>
  </div>
</template>

<script>
import CameraPanel from "./components/CameraPanel";
import ScreenPanel from "./components/ScreenPanel";
import LightPanel from "./components/LightPanel";
import WeatherPanel from "./components/WeatherPanel";
import GatewayPanel from "./components/GatewayPanel";

export default {
  name: "ProductManage",
  components: {
    CameraPanel,
    ScreenPanel,
    LightPanel,
    WeatherPanel,
    GatewayPanel
  },
  data() {
    return {
      currentTab: "CameraPanel"
    };
  }
};
</script>

<style lang="scss" scoped>
.product-manage {
  padding: 2rem;
  border-radius: 6px;
  .tab {
    padding: 0.8rem 1.4rem;
    background-color: #f2f6fd;
    margin-right: 0.5rem;
    border-top-right-radius: 8px;
    color: #333333;
    transition: all 0.3s;
    cursor: pointer;
  }
  .tab.active {
    background-color: #4360ec;
    color: #ffffff;
  }
  .tab-panel {
    padding: 1rem 0;
  }
}
</style>