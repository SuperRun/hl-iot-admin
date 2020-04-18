<template>
  <div class="nav-bar flex ai-center jc-between w-100 bg-white bx-shadow">
    <el-select v-model="value" filterable placeholder="请选择">
      <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <h1>平台名称</h1>
    <div class="flex ai-center">
      <router-link v-if="chargeOrAdmin" to="/index">
        <span class="btn text-grey-2">管理中心</span>
      </router-link>
      <router-link v-else to="/index">
        <span class="btn text-grey-2">监控中心</span>
      </router-link>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          账号(角色)
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>账号：</el-dropdown-item>
          <el-dropdown-item>角色：</el-dropdown-item>
          <el-dropdown-item>修改密码</el-dropdown-item>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "nav-bar",
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

<style lang="scss" scoped>
@import "~@/styles/_variables.scss";
.nav-bar {
  height: 60px;
  padding: 0 1rem;
  .btn {
    display: inline-block;
    margin-right: 2rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    border: 1px solid map-get($map: $colors, $key: "grey-2");
    // background-color: map-get($map: $colors, $key: "primay");
  }

  .btn:hover,
  .btn:active {
    border-color: map-get($map: $colors, $key: "blue");
    color: map-get($map: $colors, $key: "blue");
    background-color: map-get($map: $colors, $key: "blue-light");
  }
}
</style>