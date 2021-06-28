<template>
  <div class="pagePower">
    <!-- ** -->
    <div v-for="item in data" :key="item.formId" class="formPowerBox">
      <h3>{{ item.formName }}</h3>
      <div class="formPb">
        <h4>增删改</h4>
        <div class="radio">
          <el-radio-group v-model="item.scope">
            <el-radio :label="1">所有人</el-radio>
            <el-radio :label="2">仅自己</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="formPb formRole">
        <h4>&nbsp;</h4>
        <div class="radio">
          <el-checkbox v-for="power in item.formFieldDtoList" v-model="power.isShow" :key="power.fieldId">{{ power.fieldName }}</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FormPower',
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
      powserListVal: [],
      powerList: ['用户名', '性别', '年龄', '家庭住址', '邮箱', '用户名', '性别', '年龄', '家庭住址', '邮箱', '用户名', '性别', '年龄', '家庭住址', '邮箱', '用户名', '性别', '年龄', '家庭住址', '邮箱']
    }
  }
}
</script>
<style lang="scss" scoped>
  .pagePower { padding:24px; }
  .formPowerBox { margin-bottom:24px; overflow:hidden; background:#ffffff; }
  .formPowerBox h3 { padding:20px 0 0 20px; font-size:16px; font-weight:normal;}
  .formPowerBox .formPb h4 { float:left; width:20%; font-weight:normal; font-size:14px; }
  .formPowerBox .formPb .radio { float:left; width:80%; }
  .formPb   { padding:20px; clear:both; overflow:hidden; }
  .formRole { background:#F8F9FA; }
  /deep/.el-checkbox { margin-bottom:20px; }
</style>
