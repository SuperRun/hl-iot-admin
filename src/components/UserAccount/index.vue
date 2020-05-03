<template>
  <el-dropdown trigger="click">
    <span class="flex ai-center el-dropdown-link text-grey-4 cursor-pointer">
      <span style="text-align:center">
        {{userInfo.username}}
        <br />欢迎您！
      </span>
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>账号：{{userInfo.mobile}}</el-dropdown-item>
      <el-dropdown-item>角色：{{userInfo.role.name}}</el-dropdown-item>
      <el-dropdown-item>
        <button type="button" class="btn-light btn" @click="openDialog">更改密码</button>
        <button type="button" class="btn-dark btn" @click="logout">退出登录</button>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "UserAccount",
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    }
  },
  methods: {
    openDialog() {
      this.$store.dispatch("app/openPwdDialog");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push({ path: "/login" });
    }
  }
};
</script>

<style scoped>
.btn {
  border-radius: 2px;
  padding: 0.3rem 0.8rem;
}
button:last-of-type {
  margin-left: 0.5rem;
}
</style>