<template>
  <div class="device-list bg-white-3 min-h-1 bx-shadow-2">
    <ul class="flex">
      <li
        v-if="tabs.includes(11)"
        :class="['tab', currentTab == 'CameraPanel' ? 'active' : '']"
        @click="currentTab = 'CameraPanel'"
      >
        摄像头
      </li>
      <li
        v-if="tabs.includes(12)"
        :class="['tab', currentTab == 'ScreenPanel' ? 'active' : '']"
        @click="currentTab = 'ScreenPanel'"
      >
        LED屏
      </li>
      <li
        v-if="tabs.includes(13)"
        :class="['tab', currentTab == 'LightPanel' ? 'active' : '']"
        @click="currentTab = 'LightPanel'"
      >
        照明灯
      </li>
      <li
        v-if="tabs.includes(14)"
        :class="['tab', currentTab == 'WeatherPanel' ? 'active' : '']"
        @click="currentTab = 'WeatherPanel'"
      >
        气象站
      </li>
      <li
        v-if="tabs.includes(15)"
        :class="['tab', currentTab == 'CommunicationPanel' ? 'active' : '']"
        @click="currentTab = 'CommunicationPanel'"
      >
        通信设备
      </li>
    </ul>

    <div class="tab-panel">
      <component :is="currentTab"></component>
    </div>

    <!-- 设备详情弹出框 -->
    <device-detail></device-detail>
    <!-- 气象站设备详情弹出框 -->
    <weather-detail></weather-detail>
  </div>
</template>

<script>
import CameraPanel from './components/CameraPanel';
import ScreenPanel from './components/ScreenPanel';
import LightPanel from './components/LightPanel';
import WeatherPanel from './components/WeatherPanel';
import CommunicationPanel from './components/CommunicationPanel';
import DeviceDetail from '@/components/DeviceDetail';
import WeatherDetail from '@/components/WeatherDetail';

export default {
  name: 'DeviceList',
  components: {
    CameraPanel,
    ScreenPanel,
    LightPanel,
    WeatherPanel,
    CommunicationPanel,
    DeviceDetail,
    WeatherDetail,
  },
  computed: {
    tabs() {
      return this.$store.getters.tabs;
    },
  },
  data() {
    return {
      currentTab: 'CameraPanel',
      content: 'Content',
    };
  },
  methods: {
    setContent(val) {
      this.content = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.device-list {
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
