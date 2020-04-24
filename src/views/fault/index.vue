<template>
  <div class="fault-manage bg-white-3 min-h-1 bx-shadow-2">
    <div class="flex jc-between">
      <ul class="flex">
        <li
          :class="['tab', currentTab=='CameraPanel'?'active':'']"
          @click="currentTab='CameraPanel'"
        >摄像头</li>
        <li
          :class="['tab', currentTab=='ScreenPanel'?'active':'']"
          @click="currentTab='ScreenPanel'"
        >LED屏幕</li>
        <li
          :class="['tab', currentTab=='WeatherPanel'?'active':'']"
          @click="currentTab='WeatherPanel'"
        >气象站</li>
      </ul>

      <ul class="flex">
        <li :class="['tab', isCur?'active':'']" @click="isCur=true">当前告警</li>
        <li :class="['tab', !isCur?'active':'']" @click="isCur=false">历史告警</li>
      </ul>
    </div>

    <div class="tab-panel">
      <component :is="currentTab"></component>
    </div>
  </div>
</template>

<script>
import CameraPanel from "./components/CameraPanel";
import ScreenPanel from "./components/ScreenPanel";
import WeatherPanel from "./components/WeatherPanel";

export default {
  name: "FaultManage",
  components: {
    CameraPanel,
    ScreenPanel,
    WeatherPanel
  },
  data() {
    return {
      currentTab: "CameraPanel",
      isCur: true // 当前还是历史告警
    };
  }
};
</script>

<style lang="scss" scoped>
.fault-manage {
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