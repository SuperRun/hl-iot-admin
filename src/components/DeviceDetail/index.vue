<template>
  <el-dialog
    :title="title"
    :visible="deviceDetailDialogOpened"
    center
    @open="open"
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
          <span class="text-grey-2">产品：</span>
          {{
            deviceDetail.product && deviceDetail.product.title !== null
              ? `${deviceDetail.product.title}(${
                  deviceDetail.product.model !== null
                    ? deviceDetail.product.model
                    : ''
                })`
              : '无'
          }}
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">位号：</span>
          {{ deviceDetail.place_number }}
        </li>
        <li class="fs-md text-dark" v-if="deviceDetail.product_type != 5">
          <span class="text-grey-2">所属网关：</span>
          {{
            deviceDetail.gatewayData && deviceDetail.gatewayData !== null
              ? `${deviceDetail.gatewayData.device_number}(${deviceDetail.gatewayData.place_number})`
              : '无'
          }}
        </li>
        <li class="fs-md text-dark" v-if="deviceDetail.product_type == 2">
          <span class="text-grey-2">有无气象站：</span>
          {{ deviceDetail.is_weather == 1 ? '有' : '无' }}
        </li>
        <li class="fs-md text-dark" v-if="deviceDetail.product_type == 3">
          <span class="text-grey-2">分组：</span>
          {{
            deviceDetail.group !== null
              ? deviceDetail.group.group_number
              : '无分组'
          }}
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">经度：</span>
          <span class="mg-right-1">{{ deviceDetail.longitude }}</span>
          <span class="text-grey-2">纬度：</span>
          <span>{{ deviceDetail.latitude }}</span>
        </li>
        <li class="fs-md text-dark" v-if="deviceDetail.product_type !== 5">
          <span class="text-grey-2">状态：</span>
          {{ deviceDetail.status | faultStatus }}
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">安装时间：</span>
          {{ deviceDetail.created_at | formatTime }}
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
        v-if="deviceDetail.product_type !== 5"
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
    <div class="tab-panel" v-if="deviceDetailDialogOpened">
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
  name: 'DeviceDetail',
  props: {
    deviceType: {
      type: Number,
      default: 1,
    },
    content: {
      type: String,
      default: 'Content',
    },
    curContent: {
      type: String,
      default: 'Content',
    },
  },
  watch: {
    curContent(newVal) {
      console.log('curContent');
      this.currentTab = newVal;
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
    ...mapGetters(['deviceDetailDialogOpened', 'deviceDetail']),
    title() {
      if (this.deviceDetail.product_type == 5) {
        this.currentTab = 'DeviceMap';
      }
      if (this.deviceDetail) {
        let map = new Map([
          [1, '摄像头'],
          [2, 'LED屏'],
          [3, '照明灯'],
          [4, '气象站'],
          [5, '通信设备'],
        ]);
        return `设备详情(${map.get(this.deviceDetail.product_type)})`;
      }
      return '设备详情';
    },
  },
  created() {
    this.currentTab = this.content;
  },
  methods: {
    open() {
      console.log(this.deviceDetail);
    },
    close() {
      this.$store.dispatch('app/closeDeviceDialog');
      this.currentTab = 'Content';
      if (this.content == 'Fault') {
        this.$emit('hideDetail');
      }
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
