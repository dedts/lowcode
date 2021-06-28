<template>
  <section class="nc-main">
    <fm-making-form ref="makingForm" clearable upload preview generate-code generate-json>
      <template slot="action"/>
    </fm-making-form>
  </section>
</template>

<script>
export default {}
</script>
<style scoped>
.nc-main { position:absolute; top:0; left:0; right:0; bottom:0;  }
</style>
