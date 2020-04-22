<template>
  <div class="nav-bar gradient-blue-2 flex ai-center jc-between w-100 bg-white bx-shadow-1">
    <div class="flex flex-5 ai-center">
      <div :class="['logo', 'flex', 'ai-center', device==='mobile'?'hide-text':'']">
        <img src="@/assets/images/index-logo.png" alt />
        <!-- <span class="text-white">|</span> -->
        <h1 class="title">城市智慧路灯物联云平台</h1>
      </div>
      <el-select class="proj-select" v-model="value" filterable placeholder="请选择">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <div class="flex ai-center flex-1 jc-around">
      <router-link to="/index">
        <span class="text-grey-4">监控中心</span>
      </router-link>
      <user-account></user-account>
    </div>
  </div>
</template>

<script>
import UserAccount from "@/components/UserAccount";
export default {
  name: "nav-bar",
  components: {
    UserAccount
  },
  computed: {
    device() {
      return this.$store.state.app.device;
    }
  },
  data() {
    return {
      chargeOrAdmin: true,
      options: [
        {
          id: 1,
          name: "项目1"
        },
        {
          id: 2,
          name: "项目1"
        },
        {
          id: 3,
          name: "项目1"
        }
      ] // 项目
    };
  }
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
      width: 156px;
      height: 50px;
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