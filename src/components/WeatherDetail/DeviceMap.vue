<template>
  <div class="device-map">
    <div id="device-detail-map"></div>
    <svg-icon :icon-class="'reset'" class="btn-reset" @click="reset"></svg-icon>
  </div>
</template>

<script>
import BaiduMap from '@/utils/map-util';
import {mapGetters} from 'vuex';

export default {
  name: 'DeviceMap',
  data() {
    return {
      deviceMap: {},
    };
  },
  computed: {
    ...mapGetters(['deviceDetail']),
  },
  mounted() {
    this.deviceMap = new BaiduMap(
      'device-detail-map',
      {lng: this.deviceDetail.longitude, lat: this.deviceDetail.latitude},
      true,
      true,
    );
    const point = this.deviceMap.createPoint(
      this.deviceDetail.longitude,
      this.deviceDetail.latitude,
    );
    this.deviceMap.setPoint(point);
    this.deviceMap.addMark(
      this.deviceDetail.longitude,
      this.deviceDetail.latitude,
      {},
      true,
    );
  },
  methods: {
    reset() {
      this.deviceMap.reset();
    },
  },
};
</script>
<style>
.device-map {
  position: relative;
}
.btn-reset {
  position: absolute;
  right: 1rem;
  top: 1rem;
  font-size: 30px;
  cursor: pointer;
}
#device-detail-map {
  width: 100%;
  height: 350px;
}
</style>
