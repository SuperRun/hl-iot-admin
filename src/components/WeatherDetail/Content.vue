<template>
  <div class="content" v-loading="loading">
    <!-- 气象站 -->
    <div class="flex flex-column">
      <!-- <div class="refresh" @click="refresh">
        <i class="el-icon-refresh"></i>
      </div> -->
      <div class="flex text-grey-2" v-if="weatherData != null">
        <div class="flex data-item flex-column">
          <span>PM2.5：{{ weatherData.pm2 }}μg/m³</span>
          <span>气温：{{ weatherData.t }}ºC</span>
          <span>风力：{{ weatherData.ws }}m/s</span>
          <span>噪声：{{ weatherData.ns }}db</span>
        </div>
        <div class="flex data-item flex-column">
          <span>PM10：{{ weatherData.pm10 }}μg/m³</span>
          <span>湿度：{{ weatherData.h }}</span>
          <span>风向：{{ weatherData.wd | directionFilter }}</span>
        </div>
      </div>
      <div class="flex text-grey-2 mg-top-1" v-else>
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  showWarningMsg,
  showSuccessMsg,
  showInfoMsg,
  showErrorMsg,
} from '@/utils/message';
import {mapGetters} from 'vuex';
import {getLedWeatherData} from '@/api/device';
import Divider from '@/components/Divider';
export default {
  name: 'Content',
  components: {
    Divider,
  },
  data() {
    return {
      weatherData: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['deviceDetail']),
  },
  async created() {
    this.getData();
  },
  methods: {
    refresh() {
      this.getData();
    },
    getData() {
      this.loading = true;
      getLedWeatherData({device_id: this.deviceDetail.id}).then((res) => {
        if (res.data && res.data.list && res.data.list.length > 0) {
          this.weatherData = res.data.list[0];
        } else {
          this.$emit('setOffiline');
        }
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
iframe {
  margin: 1rem auto;
}
.refresh {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: #c4c4c4;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
}
.light {
  display: inline-block;
  width: 80px;
}
.progress {
  width: 500px;
}
.time {
  width: 150px;
}
.data-item {
  width: 150px;
  span {
    padding: 1rem 0 0.5rem 0;
  }
}
</style>
