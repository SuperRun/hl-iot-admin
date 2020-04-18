<template>
  <div>
    <nav-bar></nav-bar>
    <section class="flex">
      <left-menu></left-menu>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";
import LeftMenu from "./components/LeftMenu";
export default {
  components: {
    NavBar,
    LeftMenu
  }
};
</script>

<style>
</style>