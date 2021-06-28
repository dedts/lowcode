<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :unique-opened="true"
      text-color="#ccc"
      active-text-color="#fff"
      mode="vertical">
      <div v-show="sidebar.opened" class="hubebuyLogo"><img src="@/assets/huberbuylogo.png"></div>
      <div v-show="!sidebar.opened" class="hubebuyLogoSmall"><img src="@/assets/huberbuylogosmall.png"></div>
      <sidebar-item v-for="route in routes" v-if="routes.length > 0" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'
import SidebarItem from './SidebarItem'
import store from '@/store'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return store.state.user.menu
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style>
.hubebuyLogo { height:50px; overflow: hidden; }
.hubebuyLogo img { margin:7px auto 0; width:60%; display:block; }
.hubebuyLogoSmall { height:50px; overflow: hidden; }
.hubebuyLogoSmall img { margin:10px auto 0; width:30px; display:block; }
.el-menu-item.is-active { background-color: rgb(100, 53, 149) !important; color:#409eff !important}
</style>
