<template>
  <div class="flex flex-column">
    <div v-if="btns.includes(102)" class="refresh" @click="refresh">
      读状态
      <!-- <i class="el-icon-refresh"></i> -->
    </div>
    <ul
      class="flex mg-top-1"
      v-loading="loading"
      element-loading-text="获取数据中请稍等"
      element-loading-spinner="el-icon-loading"
      v-if="model != null"
    >
      <li class="flex mg-right-5">
        <span class="text-grey-2">电压：{{ model.voltage }}V</span>
      </li>
      <li class="flex mg-right-5">
        <span class="text-grey-2">电流：{{ model.electric_current }}mA</span>
      </li>
      <li class="flex mg-right-5">
        <span class="text-grey-2">功率：{{ model.power }}mW</span>
      </li>
      <li class="flex">
        <span class="text-grey-2">温度：{{ model.temperature }}ºC</span>
      </li>
    </ul>
    <p
      v-else
      v-loading="loading"
      element-loading-text="获取数据中请稍等"
      element-loading-spinner="el-icon-loading"
    >
      获取数据失败，请稍后重试。
    </p>
    <div class="flex mg-top-2 ai-center">
      <span class="text-grey-2 mg-right-1 light">亮度：{{ brightness }}%</span>
      <el-switch
        v-if="btns.includes(103)"
        class="mg-right-1"
        v-model="isFull"
        @change="setLightLightness"
        active-color="#5372FB"
        inactive-color="#D6DAEF"
      ></el-switch>
      <el-button
        class="mg-left-1 btn-light"
        v-if="!isEdit && btns.includes(103)"
        @click="isEdit = true"
        size="small"
        >编辑</el-button
      >
      <div class="flex" v-else>
        <div class="progress">
          <el-slider
            v-model="brightness"
            @change="changeBrightness"
          ></el-slider>
        </div>
        <el-button size="small" class="btn-light" @click="isEdit = false"
          >取消</el-button
        >
        <el-button size="small" class="btn-dark" @click="confirm"
          >确定</el-button
        >
      </div>
    </div>
    <div class="flex flex-column mg-top-3">
      <span class="text-dark">定时控灯：</span>
      <template
        v-if="
          deviceDetail.group &&
            deviceDetail.group.is_timing == 1 &&
            controlList.length > 0
        "
      >
        <div
          class="time flex text-dark mg-top-1 jc-between"
          v-for="(control, index) in controlList"
          :key="index"
        >
          <span>{{ control.hour }}:{{ control.minute }}</span>
          <span>{{ control.brightness }}%</span>
        </div>
      </template>
      <div class="mg-top-1" v-else>
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import { setGroupBrightness, controlGroup } from '@/api/group';
import { refreshDevice } from '@/api/device';
import { mapGetters } from 'vuex';
import { showSuccessMsg } from '@/utils/message';

export default {
  name: 'LightContent',
  computed: {
    ...mapGetters(['deviceDetail', 'btns']),
  },
  data() {
    return {
      brightness: 0,
      brightnessCopy: 0,
      isFull: true, // 亮度
      isEdit: false,
      controlList: [],
      loading: false,
      model: null,
      isSendRequest: false,
    };
  },
  async created() {
    if (this.deviceDetail.group) {
      const { list } = await this.$store.dispatch('group/detailControlGroup', {
        group_id: this.deviceDetail.group.id,
      });
      this.controlList = list;
    }
    this.brightness =
      this.deviceDetail.light_report_data == null
        ? 0
        : this.deviceDetail.light_report_data.brightness;
    this.brightness > 0 ? (this.isFull = true) : (this.isFull = false);

    this.model = this.deviceDetail.light_report_data;
  },
  watch: {
    // isFull(val) {
    //   val ? (this.brightness = 100) : (this.brightness = 0);
    // },
    brightness(val, oldVal) {
      val > 0 ? (this.isFull = true) : (this.isFull = false);
    },
  },
  methods: {
    refresh() {
      this.loading = true;
      refreshDevice({ device_ids: this.deviceDetail.id }).then(
        (res) => {
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        },
      );
    },
    setLightLightness(val) {
      if (this.isEdit) {
        return;
      }
      val ? (this.brightness = 100) : (this.brightness = 0);
      setGroupBrightness({
        device_id: this.deviceDetail.id,
        type: 1,
        brightness: this.brightness,
      }).then((res) => {
        this.isEdit = false;
        this.isSendRequest = false;
        showSuccessMsg('调节成功');
      });
    },
    changeBrightness() {
      this.isSendRequest = false;
      this.brightness > 0 ? (this.isFull = true) : (this.isFull = false);
    },
    confirm() {
      setGroupBrightness({
        device_id: this.deviceDetail.id,
        type: 1,
        brightness: this.brightness,
      }).then((res) => {
        this.isEdit = false;
        showSuccessMsg('调节成功');
      });
    },
  },
};
</script>

<style scoped>
.refresh {
  width: 60px;
  height: 30px;
  border-radius: 3px;
  background-color: #c4c4c4;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  color: #fff;
}
.light {
  display: inline-block;
  width: 80px;
}
.progress {
  width: 400px;
  margin-right: 2rem;
}
.time {
  width: 150px;
}
</style>
