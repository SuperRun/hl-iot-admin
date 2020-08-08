<template>
  <div class="nav-bar gradient-blue-2 flex ai-center jc-between w-100 bg-white bx-shadow-1">
    <div class="flex flex-4 ai-center">
      <div
        :class="[
          'logo',
          'flex',
          'ai-center',
          device === 'mobile' ? 'hide-text' : '',
        ]"
      >
        <img :src="platformConfig.logo" alt />
        <!-- <span class="text-white">|</span> -->
        <h1 class="title">{{ platformConfig.title }}</h1>
      </div>
      <el-select class="proj-select" v-model="projId" filterable placeholder="请选择" @change="change">
        <el-option v-for="item in projList" :key="item.id" :label="item.title" :value="item.id"></el-option>
      </el-select>
    </div>
    <div class="flex ai-center flex-2 jc-end">
      <router-link to="/index">
        <span class="text-grey-4 mg-right-1">监控中心</span>
      </router-link>
      <user-account></user-account>
    </div>
  </div>
</template>

<script>
import UserAccount from '@/components/UserAccount';
import { mapGetters } from 'vuex';
import { setPlatform, getPlatform } from '@/utils/auth';
import request from '@/utils/request';

export default {
  name: 'nav-bar',
  components: {
    UserAccount,
  },
  computed: {
    ...mapGetters(['projList', 'cur_proj', 'platformConfig']),
    device() {
      return this.$store.state.app.device;
    },
  },
  data() {
    return {
      chargeOrAdmin: true,
      projId: '',
      // logo: '',
      // platName: '',
    };
  },
  async mounted() {
    // 获取项目列表
    if (this.projList.length == 0) {
      await this.$store.dispatch('project/allProject');
    }
    this.projId = this.cur_proj;
    this.getPlatformConfig();
  },
  watch: {
    cur_proj() {
      this.projId = this.cur_proj;
    },
  },
  methods: {
    change() {
      this.$store.commit('project/SET_CURPROJ', this.projId);
    },
    getPlatformConfig() {
      if (!this.platformConfig) {
        const p = JSON.parse(this.platformConfig);
        this.$store.dispatch('app/setPlatformConfig', p);
        return;
      }
      this.getLogo();
    },
    getLogo() {
      request({
        url: '/getSystem',
        methods: 'get',
      }).then((res) => {
        setPlatform(res.data);
        this.$store.dispatch('app/setPlatformConfig', res.data);
      });
    },
  },
};
</script>
<style scoped>
.proj-select >>> .el-input__inner {
  background: #4461ed;
  border: none;
  border-radius: 19px;
  color: #ffffffff;
}
</style>
<style lang="scss" scoped>
.nav-bar {
  position: relative;
  z-index: 1;
  height: 60px;
  padding: 0 1rem;
  .logo {
    img {
      width: 100px;
      height: 40px;
      margin-right: 10px;
    }
    span {
      display: inline-block;
      transform: scale(1.6);
    }
    .title {
      margin: 0;
      color: #fff;
      font-size: 1.2rem;
      letter-spacing: 0.1rem;
      border-left: 2px solid #fff;
      padding: 0 0.5rem;
      height: 1.5rem;
      line-height: 1.5rem;
    }
  }
  .hide-text {
    margin-right: 50px;
    width: 40px;
    overflow: hidden;
  }
}
</style>
