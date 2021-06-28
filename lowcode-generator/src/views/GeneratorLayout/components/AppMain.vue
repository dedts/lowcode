<template>
  <div :key="key" class="scroll">
    <section class="app-main content">
      <transition name="fade-transform" mode="out-in">
        <router-view/>
      </transition>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  min-width: 800px;
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
  background:#F5F7FA;
}
.content {min-width: 800px;}
.scroll {overflow: auto}
</style>
