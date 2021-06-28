<template>
  <div class="dashboard-container"/>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  mounted() {
    if (this.$store.state.user.appStatus !== 2) {
      this.$confirm('应用未发布', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        window.history.go(-1)
      }).catch(() => {
        window.history.go(-1)
      })
    } else {
      if (this.$store.state.user.page.length <= 0 || this.$store.state.user.roleList.length <= 0) {
        this.$confirm('没有该应用权限或未设置应用菜单', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          window.history.go(-1)
        }).catch(() => {
          window.history.go(-1)
        })
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'language'
    ]),
    lang: {
      get() {
        return this.$store.state.app.language
      },
      set(lang) {
        this.$i18n.locale = lang
        this.$store.dispatch('setLanguage', lang)
      }
    }
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
