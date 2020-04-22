<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link text-grey-4 cursor-pointer">
      账号
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>账号：</el-dropdown-item>
      <el-dropdown-item>角色：</el-dropdown-item>
      <el-dropdown-item>
        <button type="button" class="btn-light btn">更改密码</button>
        <button type="button" class="btn-dark btn">退出登录</button>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "UserAccount"
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