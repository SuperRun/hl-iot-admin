<template>
  <div class="fault-manage bg-white-3 min-h-1 bx-shadow-2">
    <div class="flex jc-between">
      <ul class="flex">
        <li v-if="tabs.includes(20)" class="tab active">照明灯</li>
      </ul>

      <ul class="flex">
        <li :class="['tab', isCur ? 'active' : '']" @click="isCur = true">
          当前告警
        </li>
        <li :class="['tab', !isCur ? 'active' : '']" @click="isCur = false">
          历史告警
        </li>
      </ul>
    </div>

    <div class="tab-panel">
      <light-panel :isCur="isCur"></light-panel>
      <!-- <component :is="currentTab" :isCur="isCur"></component> -->
    </div>
  </div>
</template>

<script>
import LightPanel from './components/LightPanel';

export default {
  name: 'FaultManage',
  components: {
    LightPanel,
  },
  computed: {
    tabs() {
      return this.$store.getters.tabs;
    },
  },
  data() {
    return {
      currentTab: 'LightPanel',
      isCur: true, // 当前还是历史告警
    };
  },
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
