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
          <span class="text-grey-2">编号：</span> AS1213
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">产品：</span> 摄像头
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">位号：</span> AS1213
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">所属网关：</span> 网关1
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">分组：</span> 未分组/分组号（仅照明灯显示）
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">经度：</span>
          <span class="mg-right-1">119.1234567</span>
          <span class="text-grey-2">纬度：</span>
          <span>29.1234567</span>
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">状态：</span> 正常
        </li>
        <li class="fs-md text-dark">
          <span class="text-grey-2">安装时间：</span> YYYY-MM-DD
        </li>
      </ul>
      <div class="flex flex-1 jc-center ai-center">
        <!-- <img src="" alt v-if /> -->
        <no-image></no-image>
      </div>
    </div>
    <!-- 内容 告警 地图 -->
    <ul class="flex mg-top-1">
      <li :class="['tab', currentTab=='Content'?'active':'']" @click="currentTab='Content'">内容</li>
      <li :class="['tab', currentTab=='Fault'?'active':'']" @click="currentTab='Fault'">告警</li>
      <li :class="['tab', currentTab=='DeviceMap'?'active':'']" @click="currentTab='DeviceMap'">地图</li>
    </ul>
    <div class="tab-panel">
      <component :is="currentTab" :deviceType="deviceType"></component>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import Content from "./Content";
import Fault from "./Fault";
import DeviceMap from "./DeviceMap";
import NoImage from "@/components/NoImage";

export default {
  name: "DeviceDetail",
  props: {
    deviceType: {
      type: Number,
      default: 1
    }
  },
  components: {
    Content,
    Fault,
    DeviceMap,
    NoImage
  },
  data() {
    return {
      currentTab: "Content"
    };
  },
  computed: {
    ...mapGetters(["deviceDetailDialogOpened"]),
    title() {
      let map = new Map([
        [1, "摄像头"],
        [2, "LED屏"],
        [3, "照明灯"],
        [4, "气象站"]
      ]);
      return `设备详情(${map.get(this.deviceType)})`;
    }
  },
  methods: {
    open() {
      // 更改弹出框标题
    },
    close() {
      this.$store.dispatch("app/closeDeviceDialog");
    }
  }
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