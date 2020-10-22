<template>
  <el-dialog
    title="设备详情(气象站)"
    :visible="weatherDetailDialogOpened"
    center
    @close="close"
    width="800px"
  >
    <!-- 基础信息 -->
    <div class="info flex">
      <ul class="flex flex-column flex-1">
        <li class="fs-md text-dark">
          <span class="text-grey-2">编号：</span>
          {{ deviceDetail.device_number }}
        </li>
         <li class="fs-md text-dark">
          <span class="text-grey-2">名称：</span>
           {{
            deviceDetail.weather_name  != null&&deviceDetail.weather_name  != ''
              ? deviceDetail.weather_name  : '无'
            }}
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">产品：</span>
          {{
            deviceDetail.product != null && deviceDetail.product.title != null
              ? `${deviceDetail.product.title}(${deviceDetail.product.model})`
              : '无'
          }}
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">位号：</span>
          {{ deviceDetail.place_number }}
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">所属网关：</span>
          {{
            deviceDetail.gatewayData && deviceDetail.gatewayData !== null
              ? `${deviceDetail.gatewayData.device_number}(${deviceDetail.gatewayData.place_number})`
              : '无'
          }}
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">有无气象站：</span>
          {{ deviceDetail.is_weather == 1 ? '有' : '无' }}
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">经度：</span>
          <span class="mg-right-1">{{ deviceDetail.longitude }}</span>
          <span class="text-grey-2">纬度：</span>
          <span>{{ deviceDetail.latitude }}</span>
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">状态：</span>
          {{ deviceDetail.status | faultStatus }}
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">安装时间：</span>
          {{ deviceDetail.created_at | formatTime }}
        </li>
        <li class="fs-md text-dark">
          <span class="text-blue" @click="ledDetail">查看LED屏详情</span>
        </li>
      </ul>
      <div class="flex flex-1 jc-center ai-center">
        <img
          :src="deviceDetail.product.image"
          alt
          v-if="
            deviceDetail.product != null && deviceDetail.product.image != null
          "
        />
        <no-image v-else></no-image>
      </div>
    </div>
    <!-- 内容 告警 地图 -->
    <ul class="flex mg-top-1">
      <li
        :class="['tab', currentTab == 'Content' ? 'active' : '']"
        @click="currentTab = 'Content'"
      >
        内容
      </li>
      <li
        :class="['tab', currentTab == 'Fault' ? 'active' : '']"
        @click="currentTab = 'Fault'"
        v-if="deviceDetail.product_type == 3"
      >
        告警
      </li>
      <li
        :class="['tab', currentTab == 'DeviceMap' ? 'active' : '']"
        @click="currentTab = 'DeviceMap'"
      >
        地图
      </li>
    </ul>
    <div class="tab-panel" v-if="weatherDetailDialogOpened">
      <component :is="currentTab"></component>
    </div>
  </el-dialog>
</template>

<script>
import {mapGetters} from 'vuex';
import Content from './Content';
import Fault from './Fault';
import DeviceMap from './DeviceMap';
import NoImage from '@/components/NoImage';

export default {
  name: 'WeatherDetail',
  props: {
    deviceType: {
      type: Number,
      default: 1,
    },
  },
  components: {
    Content,
    Fault,
    DeviceMap,
    NoImage,
  },
  data() {
    return {
      currentTab: 'Content',
    };
  },
  computed: {
    ...mapGetters(['weatherDetailDialogOpened', 'deviceDetail']),
  },
  methods: {
    close() {
      this.$store.dispatch('app/closeWeatherDialog');
      this.currentTab = 'Content';
    },
    ledDetail() {
      this.$store.dispatch("app/closeWeatherDialog");
      this.$emit('showDetail');
      this.$store.commit('app/SET_DEVICE_DETAIL', this.deviceDetail);
      this.$store.commit('app/OPEN_DEVICEDIALOG');
      //this.$store.dispatch('app/closeWeatherDialog');
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
  li {
    margin-bottom: 1.5rem;
  }
  img {
    width: 200px;
    height: 200px;
  }
}
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
</style>
