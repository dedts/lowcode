<template>
  <div class="settingWrap">
    <div class="setBox">
      <!-- 封面图片 -->
      <div class="setFaceImg" @mouseenter="enterFace" @mouseleave="leaveFace">
        <template v-if="dialog.defaultFaceFlag">
          <img src="@/assets/faceBgDefault.png">
        </template>
        <template v-if="dialog.hasfaceFlag">
          <!-- 修改后封面图 -->
          <div :style="{borderBottom: '1px solid'+ appInfoData.coverColor }" class="faceImg">
            <i :class="[appInfoData.coverIcon, 'icon', 'iconfont', 'faceIcon']"/>
            <i :style="{ color: appInfoData.coverColor}" class="icon iconfont iconfaceBg"/>
          </div>
        </template>
        <!-- hover修改封面 -->
        <div v-if="dialog.faceMouseFlag" class="modFace"><span @click="modFaceImg()">修改封面</span></div>
      </div>
      <!-- 项目信息 -->
      <div class="setProject">
        <h3><span>{{ appInfoData.name }}</span><i class="el-icon-edit" @click="editProject()"/></h3>
        <ul>
          <li><span>创建人</span>{{ appInfoData.creatorName }}</li>
          <li><span>项目成员</span>{{ appInfoData.num }}</li>
          <li><span>创建时间</span>{{ appInfoData.createTime }}</li>
          <li><span>最后修改</span>{{ appInfoData.lastUpdateTime }}</li>
        </ul>
      </div>
    </div>
    <!-- 修改项目名称 -->
    <el-dialog :visible.sync="dialog.modProjectFlag" top="30vh" title="修改项目名称" width="30%">
      <el-input v-model="appName" :maxlength="15"/>
      <el-row class="btnMod">
        <el-col align="right">
          <el-button type="primary" @click="saveProjectName">保存</el-button>
          <el-button @click="dialog.modProjectFlag=false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 自定义封面 -->
    <el-dialog :visible.sync="dialog.faceFlag" top="30vh" title="自定义封面" width="30%">
      <div class="faceBox">
        <h3 class="titleColor">封面颜色</h3>
        <ul class="faceColor">
          <li v-for="(item, index) in faceIconColor.faceColor" :key="item" :class="{curr: currIndex === index }" @click="selectFaceColor(index)"><span :style="{ backgroundColor: item}" class="iconHs"><i/></span></li>
        </ul>
        <h3 class="titleColor">选择图标</h3>
        <el-select v-model="faceIcon" placeholder="请选择" class="selectFaceIcon">
          <el-option
            v-for="item in faceIconColor.faceIcon"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            <i :class="['icon', 'iconfont', 'optionFace', item.value]"/>
          </el-option>
        </el-select>
      </div>
      <el-row class="btnMod">
        <el-col align="right">
          <el-button type="primary" @click="saveFaceImg">保存</el-button>
          <el-button @click="dialog.faceFlag=false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getAppId } from '@/util/auth.js'
import { appInfo, appEdit } from '@/api/setting.js'
export default {
  data() {
    return {
      dialog: {
        defaultFaceFlag: false, // 封面默认图
        hasfaceFlag: false, // 已有封面
        modProjectFlag: false, // 修改项目名称
        faceMouseFlag: false, // 封面HOVER
        faceFlag: false, // 自定义封面弹窗
        hasNoFaceFlag: true // 没有封面
      },
      faceIconColor: {
        faceColor: [
          '#797F99',
          '#72BAA3',
          '#2A8DC9',
          '#FB6D55',
          '#EDCC74'
        ],
        faceIcon: [{
          value: 'iconproject_pie-chart',
          label: '时间'
        }, {
          value: 'iconproject_briefcase',
          label: '行李包'
        }, {
          value: 'iconproject_clipboard',
          label: '写字板'
        }, {
          value: 'iconproject_calendar',
          label: '日历'
        }, {
          value: 'iconproject_file-text',
          label: '文件'
        }, {
          value: 'iconproject_truck',
          label: '物流'
        }, {
          value: 'iconproject_package',
          label: '货物'
        }, {
          value: 'iconproject_phone',
          label: '电话'
        }, {
          value: 'iconproject_shopping-cart',
          label: '购物'
        }, {
          value: 'iconproject_users',
          label: '成员'
        }]
      },
      currIndex: 0,
      faceIcon: 'iconproject_pie-chart', // 封面图
      appId: getAppId(), // 应用ID
      appInfoData: {}, // 应用信息
      appName: '' // 修改应用名称
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化应用信息
    init() {
      appInfo(this.appId).then(resp => {
        this.appInfoData = resp.body
        // 应用名称
        this.appInfoData.name = this.appInfoData.name != undefined ? this.appInfoData.name : '未命名项目'
        // 封面图显示默认还是显示已有的
        if (!this.appInfoData.coverColor && !this.appInfoData.coverColor) {
          this.dialog.defaultFaceFlag = true
        } else {
          this.dialog.hasfaceFlag = true
        }
        // 创建时间处理
        this.appInfoData.createTime = this.appInfoData.createTime.split(' ')[0]
        // 初始化封面
        const index = this.faceIconColor.faceColor.findIndex(i => { return i === this.appInfoData.coverColor })
        this.currIndex = index
        this.faceIcon = this.appInfoData.coverIcon
      }).catch(err => {
        console.log(err)
      })
    },
    // 修改项目名称
    editProject() {
      this.appName = this.appInfoData.name
      this.dialog.modProjectFlag = true
    },
    // 保存项目名称
    saveProjectName() {
      if (!this.appName) {
        this.$message.error('名称不能为空！')
        return false
      }
      const params = { id: this.appId, name: this.appName }
      const msg = '应用重命名成功!'
      this.projectEditInterface(params, msg, true)
      this.dialog.modProjectFlag = false
    },
    // 应用编辑接口
    projectEditInterface(params, msg, updateFlag) {
      appEdit(params).then(resp => {
        if (resp.code === 200) {
          this.$message.success(msg)
          if (updateFlag) {
            this.init()
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 封面mouseenter
    enterFace() {
      this.dialog.faceMouseFlag = true
    },
    leaveFace() {
      this.dialog.faceMouseFlag = false
    },
    // 自定义封面
    modFaceImg() {
      this.dialog.faceFlag = true
    },
    // 选择颜色
    selectFaceColor(index) {
      this.currIndex = index
    },
    // 封面设置保存
    saveFaceImg() {
      const params = {
        id: this.appId,
        name: this.appInfoData.name,
        coverColor: this.faceIconColor.faceColor[this.currIndex],
        coverIcon: this.faceIcon
      }
      const msg = '封面设置成功'
      this.projectEditInterface(params, msg, true)
      this.dialog.hasNoFaceFlag = false
      this.dialog.faceFlag = false
    }
  }
}
</script>
<style lang="scss" scoped>
.settingWrap { padding:32px; }

.setFaceImg { float:left; width:172px; height:135px; overflow:hidden; position:relative; }
.modFace { width:172px; height:135px; position:absolute; left:0; top:0; z-index:5; background:rgba(0, 0, 0, 0.1) }
.modFace span { margin:52px auto 0; width:80px; height:30px; display:block; cursor:pointer; line-height:30px; font-size:12px; text-align:center; border:1px solid #0097FF; background:rgba(255, 255, 255, 0.8); color:#0097FF; }

.faceImg { width:172px; height:135px; text-align:center; line-height:110px; border:1px solid #F3F5F8; position:relative; }
.iconfaceBg { font-size:90px; }
.faceIcon { margin:-60px 0 0 -30px; font-size:40px; font-weight:300; position:absolute; left:50%; top:50%; z-index:3; }

.faceBox { padding:0 8px; }
.faceColor { margin-bottom:10px; overflow:hidden; }
.faceColor li { float:left; width:20%; }
.iconHs { width:30px; height:30px; border-radius:50%; display:inline-block; position:relative; }
.iconHs i { width:32px; height:32px; border:4px solid #ffffff; border-radius:50%; display:block; position:absolute; left:-1px; top:-1px; z-index:5; }
.faceColor .curr .iconHs i { width:26px; height:26px; border:2px solid #ffffff; left:2px; top:2px; }
.titleColor { font-size:12px; color:#A9AFB5; }

.selectFaceIcon { width:100%; }
.optionFace { color:#000000; font-size:20px; }

.setProject { float:left; margin-left:23px; width:500px; }
.setProject h3 { font-size:20px; color:#232E37; }
.setProject .el-icon-edit { margin-left:10px; font-size:18px; cursor: pointer; color:#A9AFB5; }
.setProject ul li { float:left; width:50%; font-size:14px; line-height:38px; color: rgba(0, 0, 0, 0.65); }
.setProject ul li span { width:80px; height:38px; display:inline-block; }
.btnProject { margin-top:18px; }
.btnMod     { margin:20px 0 5px; }
.stopText   { font-size:14px; color:rgba(0, 0, 0, 0.65); }
/deep/.el-dialog__body { padding:5px 16px 15px; }
.el-select-dropdown__item { float:left; padding:0; text-align:center; width:20%; height:50px; line-height:50px; }
</style>

