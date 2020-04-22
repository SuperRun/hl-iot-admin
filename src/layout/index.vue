<template>
  <div :class="classObj">
    <nav-bar></nav-bar>
    <section class="flex app-section">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <side-bar
        :class="['sidebar-container',device==='mobile'&&sidebar.opened?'sidebar-container-index':'' ]"
      ></side-bar>
      <div class="main-container flex flex-column">
        <div class="flex ai-center">
          <i
            :class="[isFold?'fold-rotate':'','el-icon-s-unfold','fold', 'fs-xxl' ,'text-grey-5']"
            @click="toggleSidebar"
          ></i>
          <breadcrumb />
        </div>
        <app-main />
      </div>
    </section>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Breadcrumb from "./components/Breadcrumb";
import AppMain from "./components/AppMain";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  components: {
    NavBar,
    SideBar,
    Breadcrumb,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  data() {
    return {
      isFold: false
    };
  },
  methods: {
    toggleSidebar() {
      this.isFold = !this.isFold;
      this.$store.dispatch("app/toggleSideBar");
    },
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-section {
  height: calc(100vh - 60px);
  .fold {
    transition: all 0.5s;
  }
  .fold-rotate {
    transform: rotate(-180deg);
  }
  .sidebar-container-index {
    z-index: 1000;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
}
</style>