<template>
  <div>
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :text-color="vars.menuText"
        :unique-opened="false"
        :active-text-color="vars.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import vars from '@/styles/sidebar-variables.scss';
import SidebarItem from './SidebarItem';
export default {
  name: 'SideBar',
  components: { SidebarItem },
  computed: {
    ...mapGetters(['sidebar', 'routes']),
    // routes() {
    //   return this.$router.options.routes;
    // },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    vars() {
      return vars;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>

<style></style>
