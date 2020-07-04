<template>
  <div class="content">
    <component :is="currentContent" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import CameraContent from './components/CameraContent';
import ScreenContent from './components/ScreenContent';
import LightContent from './components/LightContent';
export default {
  name: 'Content',
  components: {
    CameraContent,
    ScreenContent,
    LightContent,
  },
  computed: {
    ...mapGetters(['deviceDetail']),
    currentContent() {
      const map = new Map([
        [1, 'CameraContent'],
        [2, 'ScreenContent'],
        [3, 'LightContent'],
      ]);
      return map.get(this.deviceDetail.product_type);
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
  width: 400px;
  margin-right: 2rem;
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
