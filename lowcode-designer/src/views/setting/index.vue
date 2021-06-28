<template>
  <div class="setWrap">
    <el-container>
      <el-header class="navHeader"><nav-main type-page="setting" @publish="publish"/></el-header>
      <el-container>
        <el-aside width="264px">
          <div class="menuSide">
            <div v-for="(item, index) in menuSide" :key="item.compName" :class="{curr: currIndex === index}" @click="changeMenu(index)">{{ item.menuName }}</div>
          </div>
        </el-aside>
        <el-container>
          <el-main class="setMain">
            <component :is="currComponent"/>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import NavMain from '@/views/layoutcomponents/NavMain'
import setComp from '@/views/setting/components/setComp'
import roleComp from '@/views/setting/components/roleComp'
import mixins from '@/views/mixins/builderMixins'
export default {
  components: {
    NavMain,
    setComp,
    roleComp
  },
  mixins: [mixins],
  data() {
    return {
      currComponent: 'setComp',
      menuSide: [
        {
          menuName: '应用信息',
          compName: 'setComp'
        },
        {
          menuName: '角色权限',
          compName: 'roleComp'
        }
      ],
      currIndex: 0
    }
  },
  created() {
    const role = this.$route.query.type
    if (role) {
      this.currIndex = 1
      this.currComponent = 'roleComp'
    }
  },
  methods: {
    changeMenu(index) {
      this.currIndex = index
      this.currComponent = this.menuSide[index].compName
    }
  }
}
</script>
<style lang="scss" scoped>
.setWrap { background:#F8F9FA; }
.menuSide { margin-top:20px; font-size:16px; cursor:pointer; color:#232E37; }
.menuSide div { padding:0 20px; height:56px; line-height:56px; }
.menuSide .curr { color:#0097FF; }
/deep/.el-main { padding:0; height:calc(100vh - 56px); background:#ffffff; }
</style>

