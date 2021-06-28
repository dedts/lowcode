<template>
  <div class="scroll">
    <section class="app-main content">
      <transition name="fade-transform" mode="out-in">
        <router-view/>
      </transition>
    </section>
  </div>
</template>
<script>
export default {
  name: 'Welcome'
}
</script>

<style scoped>
</style>
