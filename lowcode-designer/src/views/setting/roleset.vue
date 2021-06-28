<template>
  <div class="setWrap">
    <el-container>
      <el-header class="navHeader" height="56">
        <el-row class="header">
          <el-col :span="12"><span class="btnBack"><i class="el-icon-arrow-left" @click="backCreateRole()"/><i v-if="flagRoleName" class="roleName">{{ rname }}</i><el-input v-if="flagRoleNameInput" v-model.trim="roleName" autofocus="true" maxlength="15" style="width:100px;" @blur="saveRoleName" /><i v-if="flagRoleName" class="iconfont iconri-edit-line" @click="editRoleName"/></span></el-col>
          <el-col :span="12" align="right"><a class="btnSave" @click="savePageFormAuth()">保存</a></el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="264px">
          <!-- 搜索 -->
          <div class="search">
            <el-select
              v-model="roleValue"
              :remote-method="remoteMethod"
              :loading="loading"
              multiple
              filterable
              remote
              collapse-tags
              value-key="id"
              placeholder="添加部门或成员"
              class="selectBox"
            >
              <el-option
                v-for="item in memberOptions"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </el-select>
            <i class="el-icon-circle-plus" title="添加部门成员" @click="addMemberDepartment()"/>
          </div>
          <!-- 没有角色或成员 -->
          <div v-if="departmentListFlag" class="noRole">
            <img src="@/assets/noMember.png" >
            <span>角色内暂无成员</span>
          </div>
          <!-- 成员 -->
          <div class="memberList">
            <ul>
              <li v-for="(item, index) in departmentList" :key="index" @mouseleave="hideChildMenu(index)">
                <div v-if="item.partType === 'member'" class="memberIcon">
                  <img v-if="item.headerIcon" :src="item.headerIcon">
                  <div v-else>{{ item.name && item.name.substring(item.name.length-2) }}</div>
                </div>
                <div v-else class="memberIcon memberIconImg"><img src="@/assets/noMember.png"></div>
                <span class="memberName">{{ item.name }}</span>
                <div class="boxSlide">
                  <div class="boxSlideRt">
                    <i class="icon iconfont iconiconOpt" @click="showChildMenu(index)"/>
                    <div v-show="item.slideDownFlag" class="slideDown">
                      <a @click="removeMember(item)">从组内移除</a>
                      <!--<a>客户邮件$(Email)</a>-->
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </el-aside>
        <el-container>
          <el-main class="setMain">
            <div class="roleSetTop">
              <h3>权限配置</h3>
              <span>可在此处为当前角色分别设置表单、操作项和菜单的使用权限</span>
            </div>
            <el-tabs v-model="activeName">
              <el-tab-pane label="页面权限" name="first">
                <div v-if="falgPageNoDate" class="noData"><img src="@/assets/noData.png" ></div>
                <page-power v-if="pageAuthData.length" :data.sync="pageAuthData"/>
              </el-tab-pane>
              <el-tab-pane label="表单权限" name="second">
                <div v-if="falgFormNoDate" class="noData"><img src="@/assets/noData.png" ></div>
                <form-power v-if="formAuthData.length" :data.sync="formAuthData"/>
              </el-tab-pane>
            </el-tabs>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import NavMain from '@/views/layoutcomponents/NavMain'
import PagePower from '@/views/setting/components/pagePower'
import FormPower from '@/views/setting/components/formPower'
import { getCompanyId, getAppId } from '../../util/auth'
import { findRoleInfo, userAndDepartment, roleUpdate, updateAuth, authPageSearch, authFormSearch } from '@/api/setting.js'
import { BIO } from '@/util/bio.js'
export default {
  components: {
    NavMain,
    PagePower,
    FormPower
  },
  data() {
    return {
      // Todo -- query
      rname: '', // 角色名称
      rRoleId: this.$route.query.id, // 角色ID
      // Todo -- 成员部门
      loading: false,
      memberOptions: [], // 搜索options
      roleValue: [], // 搜索值
      departmentList: [ // 成员部门列表
        // {
        //   partType: 'member',
        //   headerIcon: '',
        //   name: '寿寿',
        //   slideDownFlag: false
        // },
        // {
        //   partType: 'depart',
        //   name: '销售管理部',
        //   slideDownFlag: false
        // }
      ],
      departmentListFlag: false,
      // Todo -- 权限
      activeName: 'first',
      pageAuthData: [], // 页面权限
      formAuthData: [], // 表单权限
      pageAuthDataDeep: [], // 页面原数据
      formAuthDataDeep: [], // 表单原数据
      roleName: '', // 角色名称
      flagRoleName: true,
      flagRoleNameInput: false,
      falgPageNoDate: false,
      falgFormNoDate: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.releMemberDepartmentList()
      this.initAuth()
    },
    // 编辑角色名称
    editRoleName() {
      this.flagRoleName = false
      this.flagRoleNameInput = true
      this.roleName = this.rname
    },
    // 保存角色名称
    saveRoleName() {
      if (!this.roleName) {
        this.$message.error('角色名称不能为空')
        return false
      }
      const params = { roleIds: [this.rRoleId], roleName: this.roleName }
      roleUpdate(params).then(resp => {
        if (resp.code === 200) {
          this.$message.success('角色名称编辑成功！')
          this.rname = this.roleName
        }
        this.flagRoleName = true
        this.flagRoleNameInput = false
      }).catch(err => {
        console.log(err)
      })
    },
    // Todo -- 成员部门
    // 角色下成员，部门列表
    releMemberDepartmentList() {
      const params = this.rRoleId
      this.departmentList = []
      findRoleInfo(params).then(resp => {
        // 部门
        resp.body.departmentDtoList.forEach(item => {
          this.departmentList.push({
            id: item.id,
            partType: 'depart',
            name: item.departmentName,
            slideDownFlag: false
          })
        })
        // 成员
        resp.body.userDtoList.forEach(item => {
          this.departmentList.push({
            id: item.userId,
            partType: 'member',
            headerIcon: item.headPortrait,
            name: item.name,
            slideDownFlag: false
          })
        })
        this.rname = resp.body.roleName
        if (this.departmentList.length <= 0 && this.departmentList <= 0) {
          this.departmentListFlag = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 远程下拉选择成员部门
    remoteMethod(query) {
      const params = {
        companyId: getCompanyId(),
        likeName: null
      }
      this.loading = true
      // 为空的时候返回所有的部门，参数likeName值为null
      if (query === ' ') {
        params.likeName = null
      } else {
        params.likeName = query // 模糊搜索
      }
      userAndDepartment(params).then(resp => {
        if (resp.code === 200) {
          this.loading = false
          this.memberOptions = resp.body
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加部门和成员
    addMemberDepartment() {
      let hasMember = null
      // 为空判断
      if (this.roleValue.length <= 0) {
        this.$message.error('请选择要添加成员或部门')
        return false
      }
      // 过滤是否重复，重复不能添加
      for (var i = 0; i < this.departmentList.length; i++) {
        hasMember = this.roleValue.some(item => item.id === this.departmentList[i].id)
        if (hasMember) {
          break
        }
      }
      if (hasMember) {
        this.$message.error('添加成员或部门不能重复')
        return false
      }
      const params = {
        roleIds: [this.rRoleId],
        departmentDtoList: [],
        userDtoList: []
      }
      this.roleValue.forEach(item => {
        if (item.type === 1) {
          params.userDtoList.push({ userId: item.id })
        } else if (item.type === 2) {
          params.departmentDtoList.push({ id: item.id })
        }
      })
      roleUpdate(params).then(resp => {
        if (resp.code === 200) {
          this.$message.success('添加成功！')
          this.releMemberDepartmentList()
          this.roleValue = []
          this.departmentListFlag = false
        } else {
          this.$message.error(resp.body)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 删除部门和成员
    removeMember(item) {
      const params = {
        roleIds: [this.rRoleId],
        departmentDtoList: [],
        userDtoList: [],
        isRemove: 1
      }
      if (item.partType === 'member') { // 成员
        params.userDtoList.push({ userId: item.id })
      } else if (item.partType === 'depart') { // 部门
        params.departmentDtoList.push({ id: item.id })
      }
      roleUpdate(params).then(resp => {
        if (resp.code === 200) {
          this.$message.success('移除成功!')
          item.slideDownFlag = false
          this.releMemberDepartmentList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    showChildMenu(index) {
      this.departmentList[index].slideDownFlag = true
    },
    hideChildMenu(index) {
      this.departmentList[index].slideDownFlag = false
    },
    // Todo -- 返回创建页
    backCreateRole() {
      this.$router.push({ path: '/' + BIO.tenTo62(getAppId()) + '/design/setting', query: { type: 'role' }})
    },
    // Todo -- 权限
    // 初始化权限
    initAuth() {
      // 页面权限
      const pageAuthParams = {
        id: this.rRoleId,
        companyId: getCompanyId(),
        appId: getAppId()
      }
      authPageSearch(pageAuthParams).then(resp => {
        if (resp.code === 200) {
          this.pageAuthData = resp.body || []
          if (this.pageAuthData.length <= 0) {
            this.falgPageNoDate = true
          }
          // 深拷贝保留一份页面原数据
          this.pageAuthDataDeep = JSON.parse(JSON.stringify(this.pageAuthData))
        }
      }).catch(err => {
        console.log(err)
      })
      // 表单权限
      const formAuthParams = {
        id: this.rRoleId,
        companyId: getCompanyId(),
        appId: getAppId()
      }
      authFormSearch(formAuthParams).then(resp => {
        if (resp.code === 200) {
          this.formAuthData = resp.body || []
          if (this.formAuthData.length <= 0) {
            this.falgFormNoDate = true
          }
          // 深拷贝保留一份表单原数据
          this.formAuthDataDeep = JSON.parse(JSON.stringify(this.formAuthData))
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // -页面权限- 比对改变的数据
    arrayComparePage() {
      // console.log('更改数据=>', this.pageAuthData)
      // console.log('原数据=>', this.pageAuthDataDeep)
      const arrayResult = []
      this.pageAuthDataDeep.forEach(itemOri => {
        this.pageAuthData.forEach(itemMod => {
          // 一级菜单比对
          if (itemOri.pageId === itemMod.pageId && itemOri.isShow !== itemMod.isShow) {
            arrayResult.push({
              id: itemMod.id || null,
              pageId: itemMod.pageId,
              fatherPageId: itemMod.fatherPageId,
              isShow: itemMod.isShow
            })
          }
          // 二级菜单比对
          itemOri.pageDtoList.forEach(sItemOri => {
            itemMod.pageDtoList.forEach(sItemMod => {
              if (sItemOri.pageId === sItemMod.pageId && sItemOri.isShow !== sItemMod.isShow) {
                arrayResult.push({
                  id: sItemMod.id || null,
                  pageId: sItemMod.pageId,
                  fatherPageId: sItemMod.fatherPageId,
                  isShow: sItemMod.isShow
                })
              }
            })
          })
        })
      })
      return arrayResult
    },
    // -表单权限- 比对改变的数据
    arrayCompareForm() {
      // console.log('更改数据=>', this.formAuthData)
      // console.log('原数据=>', this.formAuthDataDeep)
      const arrayResult = []
      this.formAuthDataDeep.forEach(itemOri => {
        this.formAuthData.forEach(itemMod => {
          // 一级表单比对
          // 一级有修改,二级改过的
          // 二级更改的
          if (itemOri.formId === itemMod.formId && this.arrayCompareFormSecond(itemOri.formFieldDtoList, itemMod.formFieldDtoList).length > 0) {
            arrayResult.push({
              id: itemMod.id || null,
              formId: itemMod.formId,
              scope: itemMod.scope,
              formFieldDtoList: this.arrayCompareFormSecond(itemOri.formFieldDtoList, itemMod.formFieldDtoList)
            })
          } else {
            // 二级无更改
            if (itemOri.formId === itemMod.formId && itemOri.scope !== itemMod.scope) {
              arrayResult.push({
                id: itemMod.id || null,
                formId: itemMod.formId,
                scope: itemMod.scope,
                formFieldDtoList: []
              })
            }
          }
        })
      })
      return arrayResult
    },
    // -表单权限- 二级数组比对
    arrayCompareFormSecond(itemOri, itemMod) {
      const arrayResultSecond = []
      itemOri.forEach(sItemOri => {
        itemMod.forEach(sItemMod => {
          if (sItemOri.fieldId === sItemMod.fieldId && sItemOri.isShow !== sItemMod.isShow) {
            arrayResultSecond.push({
              id: sItemMod.id || null,
              fieldId: sItemMod.fieldId,
              isShow: sItemMod.isShow
            })
          }
        })
      })
      return arrayResultSecond
    },
    // 保存权限
    savePageFormAuth() {
      // console.log('更改数据=>', this.formAuthData)
      // console.log('原数据=>', this.formAuthDataDeep)
      // 页面权限修改后的数据
      const pageAuthDataResult = this.arrayComparePage()

      // 表单权限修改后的数据
      const formAuthDataResult = this.arrayCompareForm()

      // 提交权限数据
      const saveParams = {
        id: this.rRoleId,
        companyId: getCompanyId(),
        appId: getAppId(),
        pageDtoList: pageAuthDataResult,
        formDtoList: formAuthDataResult
      }
      updateAuth(saveParams).then(resp => {
        if (resp.code === 200) {
          this.$message.success('权限配置成功！')
          this.$router.push({ path: '/' + BIO.tenTo62(getAppId()) + '/design/setting', query: { type: 'role' }})
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .setWrap { background:#ffffff; }
  .navHeader .header { height:56px; line-height:56px; border-bottom:1px solid #E8E8E8; background:#ffffff; }
  .btnBack { margin-left:20px; }
  .btnSave { width:64px; text-align:center; display:block; color:#fff; background:#0097FF; }
  .search { padding:7px 40px 0 10px; height:41px; background:#F8F9FA; position:relative; }
  .el-icon-circle-plus { font-size:22px; color:#ccc; position:absolute; right:10px; top:9px; z-index:3; }
  .el-icon-circle-plus:hover { color:#409EFF; }
  .selectBox { width:100%; }
  .noRole { margin-top:50%; }
  .noRole img { margin:0 auto; display:block; }
  .noRole span { line-height:50px; display:block; text-align:center; color:#A9AFB5; }
  .memberList { margin-top:20px; }
  .memberList li { margin-bottom:10px; padding:10px 42px 10px 52px; height:52px; position:relative; }
  .memberList li:hover,.memberList .curr { background:#F8F9FA; }
  .memberList .curr { color:#409EFF; }
  .memberIcon { width:32px; height:32px; border-radius:50%; overflow:hidden; position:absolute; left:10px; top:10px;   text-align: center;line-height: 32px;background-color: #000; color:#fff;}
  .memberIcon span { width:32px; height:32px; display:block; line-height:32px; font-size:14px; text-align:center; border-radius:50%; background:#666666; color:#fff; overflow:hidden;}
  .memberIconImg { background:#ffffff; }
  .memberIcon img { width:32px; height:32px; }
  .memberName { height:32px; line-height:32px; font-size:14px; display:block; }
  .boxSlide { width:32px; height:32px; position:absolute; right:10px; top:10px; z-index: 3; }
  .boxSlideRt { width:32px; height:32px; position:relative; }
  .slideDown { padding:10px 0; width:150px; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1); background:#ffffff; position:absolute; right:0; top:32px; z-index:3; }
  .slideDown a { padding:0 10px; height:30px; display:block; line-height:30px; color: #232E37; }
  .slideDown a:hover { background:#F8F9FA; }
  .slideDown a i { font-style: normal; color:#666666; }
  .iconiconOpt { margin-top:3px; display:none; }
  .memberList li:hover .iconiconOpt { display:block; }

  .roleSetTop  { padding:32px 32px 0 32px; background:#fff; }
  .roleSetTop h3 { font-weight:normal; font-size:20px; }
  .roleSetTop span { font-size:12px; color:#A9AFB5; }
  .el-icon-arrow-left { margin-right:5px; cursor: pointer; }

  /deep/.el-main { padding:0; height:calc(100vh - 56px); border-left:1px solid #E8E8E8; background:#F0F0F0; }
  /deep/.el-tabs__nav-scroll { padding-left:32px; background:#ffffff; }
  /deep/.el-tabs__header { margin:0; }
  .iconri-edit-line { margin-left:5px; color:#999999; }
  .roleName { font-style:normal; }
  .noData img { margin:10% auto 0; display:block;  }
</style>

