<template>
  <div class="pagePower">
    <div v-for="item in data" :key="item.pageId" class="boxPower">
      <dl>
        <dt>{{ item.pageName }}</dt>
        <dd>
          <el-radio-group v-model="item.isShow">
            <el-radio :label="true">可见</el-radio>
            <el-radio :label="false">不可见</el-radio>
          </el-radio-group>
        </dd>
      </dl>
      <dl v-for="itemChild in item.pageDtoList" :key="itemChild.pageId">
        <dt>{{ itemChild.pageName }}</dt>
        <dd>
          <el-radio-group v-model="itemChild.isShow">
            <el-radio :label="true">可见</el-radio>
            <el-radio :label="false">不可见</el-radio>
          </el-radio-group>
        </dd>
      </dl>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PagePower',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    // console.log(this.data)
  },
  methods: {
    // 当一级菜单不可见，二级菜单也不可见
    changePagePower(item) {
      // if (item.isShow === false) {
      //   item.pageDtoList.forEach(itemChild => {
      //     itemChild.isShow = false
      //   })
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
  .pagePower { padding:24px; }
  .boxPower { margin-bottom:24px; padding:15px; overflow:hidden; background:#ffffff; }
  .boxPower dl { clear:both; line-height:40px; }
  .boxPower dt { float:left; width:20%; }
  .boxPower dd { float:left; width:300px; }
  /deep/.el-radio { margin-right:80px; }
</style>
