<template>
  <div class="appWrap appListWrap">
    <!-- 我的应用 -->
    <el-row>
      <el-col :span="12">
        <h3>我的应用</h3>
      </el-col>
      <el-col v-if="isAdmin || isCompanyCreate" :span="12" align="right">
        <el-button type="primary" class="btnCreateApp" @click="createApp()">
          <i class="el-icon-circle-plus-outline" />创建应用
        </el-button>
        <el-button type="primary" class="btnCreateApp" @click="jumpData">
          <i class="el-icon-coin" />数据工厂
        </el-button>
      </el-col>
    </el-row>

    <!-- 暂无应用 -->
    <div v-if="appFlag.noAppFlag" class="myAppNo">
      <img src="@/assets/noData.png"><span>暂无应用</span>
    </div>

    <!-- 应用列表 -->
    <div v-else class="appList">
      <ul :style="{ width: appUlWidth + 'px' }">
        <li v-for="(item,index) in applicationList" :key="item.id" @click="toApplication(item)">
          <div :style="{borderBottom: '1px solid'+ ' '+item.coverColor, width: appLiWidth + 'px' }" class="appBox">
            <i v-if="item.status===1" class="iconQy">未启用</i>
            <svg-icon :style="{color:item.coverColor}" icon-class="faceBg" class="appIcon" />
            <svg-icon :icon-class="item.coverIcon" class="faceImg" />
            <span class="appName">{{ item.name }}</span>
            <span class="appDate">创建于{{ item.createTime }}</span>
            <div v-if="isAdmin || isCompanyCreate" class="appOpreate">
              <span @click.stop="edit(2,index)">编辑</span>|<span @click.stop="showDialog(item,1)">重命名</span>|<i v-if="item.status === 1"><span @click="appStart(item)">开启</span>|</i><i v-if="item.status === 2"><span @click.stop="showStopAppDialog(item)">停用</span>|</i><span style="color:#FF5722;" @click.stop="showDialog(item,2)">删除</span>
            </div>
            <div v-else :style="{width: appLiWidth + 'px' }" class="memberHover">
              <el-button type="primary">
                访问应用 >
              </el-button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 重命名1 删除2 应用 -->
    <el-dialog :show-close="false" :visible.sync="appFlag.appDelDialogVisible" width="30%">
      <h3 class="appDialogTitle mb15 mt15">
        重命名
      </h3>
      <el-form ref="myApp" :model="myApp">
        <el-form-item :rules="[{ required: true, message: '请输入应用名称', trigger: 'blur' }]" prop="appName">
          <el-input v-model="myApp.appName" maxlength="15" show-word-limit placeholder="请输入应用名称" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button class="btnApp" @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="edit(1)">重命名</el-button>
      </span>
    </el-dialog>
    <!--删除-->
    <delete-dialog v-if="appFlag.deleteVisible" :visible.sync="appFlag.deleteVisible" :is-show-input="true" :input-text.sync="myApp.appName" :title="`是否删除「${name}」？`" content="将彻底删除应用内全部信息，此操作不可逆。" placeholder="输入应用名称" @cancel="cancelDialog" @confirm="deleteApp" />
    <!-- 是否停用项目？ -->
    <delete-dialog v-if="dialog.stopProjectFlag" :visible.sync="dialog.stopProjectFlag" delete-text="停用项目" title="是否停用项目？" content="停用后，项目内的成员将不可使用此项目，是否仍停用？" @cancel="cancelDialog" @confirm="appStopProject" />
  </div>
</template>
<script>
import { aplictionList, aplictionDelete, aplictionEdit } from '../../../api/company'
import deleteDialog from '@/components/deleteDialog'
import { BIO } from '@/utils/bio'
export default {
  components: { deleteDialog },
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    },
    isCompanyCreate: {
      type: Boolean,
      default: false
    },
    companyId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialog: {
        stopProjectFlag: false, // 停用项目
        projectStartFlag: false, // 启用按钮状态
        projectStopFlag: false // 停用按钮状态
      },
      appFlag: {
        noAppFlag: false, // 没有应用
        appDelDialogVisible: false, // 添加应用弹窗
        deleteVisible: false // 删除弹窗
      },
      myApp: {
        appName: ''
      },
      applicationList: [],
      // 正在删除的和重命名的应用
      name: '',
      id: '',
      type: null,
      appLiWidth: 291,
      appUlWidth: 955,
      currAppInfo: {} // 当前APP信息
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 设置我的应用列表尺寸
      this.myAppSize()
      aplictionList({ companyId: this.companyId }).then(res => {
        this.applicationList = res.body
        if (this.applicationList.length <= 0) {
          this.appFlag.noAppFlag = true
        }
      })
    },
    // 自适应应用列表
    myAppSize() {
      /*
      *  < 1200
      * 初始值 appulWidth, appLiWidth, 3列
      * > 1200
      * 计算 appUlwidth, appLiWidth, 4列
      * */
      const _this = this
      this.computedSize(_this)
      window.onresize = function() {
        _this.computedSize(_this)
      }
    },
    computedSize(_this) {
      // 可视区宽度
      const windowWidth = document.body.clientWidth
      // 列数
      const colCount = Math.ceil((windowWidth - 326) / 320)
      if (windowWidth <= 1200) {
        // console.log('小于1200')
        _this.appUlWidth = 955
        _this.appLiWidth = 291
      } else {
        // console.log('大于1200')
        // appLiWidth = Math.floor(屏幕尺寸 - 左右padding和 - 间距 * (列数-1) - box边框 * 列数) / 列数
        _this.appUlWidth = windowWidth - 245
        _this.appLiWidth = Math.floor((windowWidth - 270 - 25 * (colCount - 1) - 2 * colCount) / colCount)
      }
    },
    // 创建应用
    createApp() {
      const path = '/' + this.$route.params.companyId + '/company/createapp'
      this.$router.push({ path })
    },
    jumpData(){
      window.open('https://testdatafactory.huberbuy.com/#/login')
    },
    // 预览应用
    toApplication(item) {
      if (item.status === 1) return
      window.open(process.env.VUE_APP_GENERATOR_API + BIO.tenTo62(item.id) + '/app/', '_self')
    },
    // 显示删除APP弹窗
    showDialog(item, type) {
      // type 1 重命名 2 删除
      this.type = type
      if (type === 1) {
        if (this.$refs['myApp'] !== undefined) {
          this.$refs['myApp'].resetFields()
        }
        this.myApp.appName = item.name
        this.appFlag.appDelDialogVisible = true
      } else {
        this.appFlag.deleteVisible = true
      }
      this.id = item.id
      this.name = item.name
    },
    // 删除应用
    deleteApp() {
      if (this.name !== this.myApp.appName) {
        this.$message.error('名称不相符')
        return
      }
      const option = {
        id: this.id
      }
      aplictionDelete(option).then(res => {
        this.$message.success('应用已删除')
        this.init()
        this.cancelDialog()
      })
    },
    // 编辑应用
    edit(type, index) {
      if (type === 1) { // 重命名
        this.$refs.myApp.validate((valid) => {
          if (valid) {
            const option = {
              name: this.myApp.appName,
              id: this.id
            }
            aplictionEdit(option).then(res => {
              this.$message.success('重命名成功')
              this.appFlag.appDelDialogVisible = false
              this.init()
            })
          }
        })
      } else { // 编辑
        const id = this.applicationList[index].id
        window.location.href = process.env.VUE_APP_DESIGN_API + BIO.tenTo62(id) + '/design'
      }
    },
    // 开启应用
    appStart(item) {
      const params = {
        id: item.id,
        name: item.name,
        status: 2
      }
      const msg = '应用已开启'
      this.projectEditInterface(params, msg)
    },
    // 停用应用弹出框
    showStopAppDialog(item) {
      this.currAppInfo = item
      this.dialog.stopProjectFlag = true
    },
    // 停用应用
    appStopProject() {
      const params = {
        id: this.currAppInfo.id,
        name: this.currAppInfo.name,
        status: 1
      }
      const msg = '应用已停用'
      this.projectEditInterface(params, msg)
      this.dialog.stopProjectFlag = false
    },
    // 应用编辑接口
    projectEditInterface(params, msg) {
      aplictionEdit(params).then(resp => {
        if (resp.code === 200) {
          this.$message.success(msg)
          this.init()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    cancelDialog() {
      this.id = ''
      this.name = ''
      this.myApp.appName = ''
      this.appFlag.appDelDialogVisible = false
      this.appFlag.deleteVisible = false
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.btnCreateApp i { margin-right:5px; }
.myAppNo { margin:50px auto 0; width:288px; }
.myAppNo span { line-height:40px; display:block; font-size:14px; text-align:center; color:rgba(0, 0, 0, 0.25); }
.appList    { margin-top:20px; }
.appList ul { display: flex; flex-wrap: wrap; }
.appList li { margin-bottom:25px; flex: 0 1 auto;  }
.appBox     { margin-right:25px; height:220px; border-radius:2px; cursor:pointer; border-top:1px solid #D9D9D9; border-right:1px solid #D9D9D9; border-bottom:1px solid #7A7F97; border-left:1px solid #D9D9D9; font-size:14px; text-align:center; background-position:center center; position:relative; overflow:hidden; }
.appBox .appOpreate { width:100%; height:40px; font-size:12px; text-align:center; line-height:40px; background:rgba(255, 255, 255,0.8); position:absolute; left:0; bottom:-40px; z-index:5; }
.appBox .appOpreate span { margin:0 8px; color:rgba(0, 0, 0, 0.65);cursor: pointer; }
.appBox:hover .appOpreate { bottom:0;}
.appBox:hover .memberHover{top: 0}
.memberHover{width: 350px;height: 220px;line-height: 220px;position: absolute;top: 300px;left: 0;background-color:rgba(255, 255, 255,0.6)}
.appIcon { margin-top:20px; font-size:100px; position: relative;left: 15px; }
.faceImg{position: absolute;right: 40%;font-size: 60px;top: 50px;
  color: #000;}
.appName { margin:30px 0 0px; height:30px; display:block;}
.appDate { color:rgba(0, 0, 0, 0.45); font-size:12px; }
.iconQy  { width:50px; height:20px; line-height:20px; text-align:center; display:block; font-size:12px; background:rgba(0, 0, 0, 0.65); color:#ffffff; position:absolute; left:5px; top:5px; z-index:3; }
.appDialogTitle { font-size:16px; }
.appDialogText  { margin-bottom:10px; line-height:40px; display:block; font-size:14px; }
</style>
