<template>
  <div style="margin-bottom: 50px;">
    <el-row :gutter="30">
      <el-col :span="4">
        <div class="title">
          公司成员
        </div>
        <!--部门分组-->
        <div class="cardBox mt20">
          <el-row :class="['card','text', isAllData?'active':'']" @click.native="getMemberList(1)">
            <el-col :span="22">
              全部成员
            </el-col>
            <el-col :span="2" align="right">
              {{ allMember }}
            </el-col>
          </el-row>
          <el-row v-for="(item,index) in department" :key="item.id" :class="['card','text', item.id===activeDepartment?'active':'']" @mouseleave.native="hoverLeaveDepartment(index)">
            <el-col :span="22" @click.native="changeDepartment(item.id)">
              {{ item.departmentName }}
            </el-col>
            <el-col :span="2" align="right">
              <span :class="{num:isAdmin || isCompanyCreate}">{{ item.userNumber }}</span>
              <span v-if="isAdmin" class="hiddle">
                <span class="curpion" @click="showDialogDepartment(index)"><svg-icon icon-class="more" /></span>
              </span>
              <div v-show="item.showDialog" class="btnGroup">
                <div class="hoverBtn text" @click="openDialog('renameDepartment',index)">部门重命名</div>
                <div class="hoverBtn" style="color:#FF5722" @click="deleteDepartment(index)">删除部门</div>
              </div>
            </el-col>
          </el-row>
          <el-row :class="['card','text', isUnGrouped?'active':'']" @click.native="getMemberList(3)">
            <el-col :span="22">未分配</el-col>
            <el-col :span="2" align="right">{{ unGrouped }}</el-col>
          </el-row>
          <div v-if="isAdmin || isCompanyCreate" class="tac card">
            <el-button type="text" @click="openDialog('creatDepartment')">+ 创建部门</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <!--按钮组-->
        <div v-if="isAdmin || isCompanyCreate">
          <el-row v-if="!isBatch">
            <el-col :span="12">
              <span v-if="memberList.length" class="batchBtn" @click="isBatch=true;countTrue=0"><i class="el-icon-edit" />&nbsp;&nbsp;批量操作</span>
              <span v-else>&nbsp;</span>
            </el-col>
            <el-col :span="12" align="right">
              <!--<el-button @click="openDialog('import')"><svg-icon icon-class="import"/> 导入员工</el-button>-->
              <el-button type="primary" @click="openDialog('inviteMobile')">+ 添加成员</el-button>
            </el-col>
          </el-row>
          <el-row v-if="isBatch">
            <el-col :span="12">
              <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
              <el-button type="text" icon="el-icon-close" class="ml10" @click="cancelBatch">取消批量</el-button>
            </el-col>
            <el-col :span="12" align="right">
              <el-button type="danger" plain @click="openDialog('deleteMember')">删除</el-button>
              <el-button @click="openDialog('dispatchApp')">分配应用</el-button>
              <el-button @click="openDialog('removeMember')">移动至部</el-button>
            </el-col>
          </el-row>
        </div>
        <!--成员信息-->
        <div v-if="showMember">
          <div v-if="memberList.length" class="mt20 tableBox ">
            <el-row v-for="(item,index) in memberList" :key="item.userId" class="row" @mouseleave.native="hoverLeave(index)">
              <el-col :span="1" style="width: 20px">
                <el-checkbox v-show="isBatch" v-model="item.checked" style="padding-top: 12px;" @change="checkedChange" />
              </el-col>
              <el-col :span="11" class="rowLeft" @click.native="memberInfo(item.userId)">
                <div class="mr10 ml15">
                  <img v-if="item.headPortrait" :src="item.headPortrait" alt="" class="imgBox">
                  <div v-else :style="{'background-color': bgColor(item.status)}" class="imgDefault">
                    {{ item.name && item.name.substring(item.name.length-2) }}
                  </div>
                </div>
                <div>
                  <div class="mb5">
                    <span class="rowName">{{ item.name }}</span>
                    <span v-if="item.isAdmin || item.isCompanyCreate" class="text" style="color:#4557F6">{{ item.isCompanyCreate ?'创建者':'管理员' }}</span>
                  </div>
                  <div>
                    <span v-if="item.status === 2 || item.status===4 || item.status===5" class="rowLeftStatus">{{ item.statusDec }}</span>
                    <span v-if="isAdmin || isCompanyCreate" class="text">活跃时间：{{ item.activeTime }}</span>
                  </div>
                </div>
              </el-col>
              <el-col v-if="isAdmin" :span="12" align="right" class="text">
                <span v-if="item.isAdmin || item.isCompanyCreate" class="inlineBlock lh40">应用权限：全部应用</span>
                <span v-else class="inlineBlock lh40">应用权限： {{ item.applicationPower }}</span>
              </el-col>
              <el-col v-if="isCompanyCreate || (isAdmin&&!item.isCompanyCreate)" align="right" class="more">
                <span class="curpion" @click="showDialog(index)"><svg-icon icon-class="more" /></span>
                <div v-if="item.showDialog" class="btnGroup">
                  <div v-if="!item.isCompanyCreate" class="hoverBtn text card" @click="openDialog('settingMember',index,1)">设为/取消管理员</div>
                  <div class="hoverBtn text card" @click="memberEdit(item.userId)">编辑信息</div>
                  <div v-show="!item.isAdmin" class="hoverBtn text card" style="color:#FF5722" @click="openDialog('deleteSingleMember',index,2)">从公司中删除</div>
                </div>
              </el-col>
            </el-row>
            <!--分页-->
            <div>
              <div class="paginationTotal">共{{ total }}条</div>
              <div class="tac mt15 mb15">
                <el-pagination
                  :total="total"
                  :page-size="10"
                  :current-page.sync="pagination.page"
                  layout="prev, pager, next"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </div>
          <div v-else class="noMember tac">
            <img src="../../../assets/noData.png" alt="">
            <div class="mt15 text" style="font-size: 14px;">暂无成员</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--导入弹窗 import-->
    <el-dialog :visible.sync="importDialogVisible" :show-close="false" :close-on-click-modal="false" width="30%">
      <div class="title mb10">导入成员</div>
      <span>请在Excel中按照模板格式录入成员。</span>
      <el-button type="text" @click="downTemplate">下载Excel模板</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-upload
          ref="upload"
          :show-file-list="false"
          :on-change="importExcel"
          :auto-upload="false"
          action="/"
          class="inlineBlock ml10"
        >
          <el-button type="primary">选择文件</el-button>
        </el-upload>
      </span>
    </el-dialog>
    <!--展示上传员工的弹窗-->
    <el-dialog :visible.sync="memberDialog" :show-close="false" :close-on-click-modal="false" width="30%">
      <div>
        <div class="text" style="font-size: 14px;">已导入"{{ xlsxName }}"</div>
        <el-table :data="xlsxJson" style="width: 100%">
          <el-table-column prop="name" label="员工姓名" />
          <el-table-column prop="sex" label="性别" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="mobile" label="手机号" />
          <el-table-column prop="department" label="部门" />
          <el-table-column prop="remark" label="备注信息" />
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="confirmImport">确认导入</el-button>
      </span>
    </el-dialog>
    <!--创建部门弹窗 -->
    <el-dialog :visible.sync="creatDepartmentDialog" :show-close="false" :close-on-click-modal="false" width="30%">
      <div>
        <div class="title mb10">创建部门</div>
        <el-form ref="addPartmentForm" :model="createDepartment">
          <el-form-item :rules="[{ required: true, message: '请输入部门名称', trigger: 'blur' }]" prop="newDepartment">
            <el-input v-model.trim="createDepartment.newDepartment" maxlength="15" show-word-limit placeholder="请输入部门名称" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!--重命名部弹窗-->
    <el-dialog :visible.sync="renameDepartmentDialog" :show-close="false" :close-on-click-modal="false" width="30%">
      <div>
        <el-form ref="renameDepartment" :model="renameDepartment">
          <div class="title mb10">重命名部门</div>
          <el-form-item :rules="[{required:true,message:'请输入部门名称',trigger:'blur'}]" prop="rename">
            <el-input v-model.trim="renameDepartment.rename" maxlength="15" show-word-limit placeholder="填写部门名称" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="confirmRename">确 定</el-button>
      </span>
    </el-dialog>
    <!--删除部门失败弹窗-->
    <!--<delete-dialog :visible.sync="deleteDepartmentDialog" :is-single-btn="true" title="删除失败" content="该部门中仍有成员，成员移除后可删除部门" />-->
    <!--删除部门二次弹窗-->
    <delete-dialog :visible.sync="againSureDeleteDepartmentDialog" :content="`是否确认删除该部门「${removeDepartmentInfo.departmentName}」？部门删除后，原部门人员将被移动到“未分配”`" title="删除部门" @cancel="cancelDialog" @confirm="comfirmDeleteDepartment" />
    <!--移动成员至部门弹窗-->
    <el-dialog :visible.sync="removeMemberDialog" :show-close="false" :close-on-click-modal="false" width="30%">
      <div>
        <el-row>
          <el-col :span="12" class="title mb10">选择部门</el-col>
          <el-col :span="12" align="right" class="text mt10">已选{{ countTrue }} 人</el-col>
        </el-row>
        <div class="checkBox">
          <el-radio-group v-model="removeMemberDepartment">
            <el-radio v-for="item in department" :key="item.id" :label="item.id">{{ item.departmentName }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="batchRemoveMember">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配应用弹窗-->
    <el-dialog :visible.sync="dispatchAppDialog" :show-close="false" :close-on-click-modal="false" width="30%">
      <div>
        <el-row>
          <el-col :span="12" class="title mb10">选择应用</el-col>
          <el-col :span="12" align="right" class="text mt10">已选{{ countTrue }} 人</el-col>
        </el-row>
        <div class="checkBox">
          <el-checkbox-group v-model="checkList" class="checkbox-group">
            <el-checkbox v-for="item in applicationList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="batchUpdateApp">确 定</el-button>
      </span>
    </el-dialog>
    <!--批量删除成员确认框-->
    <delete-dialog :visible.sync="deleteMemberDialog" :is-show-icon="true" :title="`确认删除${countTrue}名成员？`" content="成员将从公司内删除，成员操作数据将保留，被删除的成员将不能再使用公司内任何应用。" @cancel="cancelDialog" @confirm="batchDeleteMember" />
    <!--添加员工  只输手机号-->
    <el-dialog :visible.sync="inviteMobileDialog" :show-close="false" :close-on-click-modal="false" width="30%">
      <div>
        <div class="title mb10">添加成员</div>
        <el-form ref="inviteForm" :model="invite">
          <el-form-item :rules="[{ required: true, pattern: /^1[3-9](\d{9})$/, message: '请输入正确手机号', trigger: 'blur' }]" prop="inviteMobile">
            <el-input v-model="invite.inviteMobile" placeholder="请输入对方手机号" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="confirmInviteMobile">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加员工详情-->
    <el-dialog :visible.sync="addMemberDialog" :show-close="false" :close-on-click-modal="false" width="30%" style="margin-top: -10vh;">
      <div>
        <div class="title mb10">添加成员</div>
        <el-form ref="ruleForm" :model="addMemberInfo" :rules="addMemberrules">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addMemberInfo.name" placeholder="填写姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addMemberInfo.mobile" :disabled="true" placeholder="填写手机号" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addMemberInfo.email" placeholder="填写邮箱" />
          </el-form-item>
          <el-form-item label="部门" prop="departmentId">
            <el-select v-model="addMemberInfo.departmentId" placeholder="未分配" style="width: 100%">
              <el-option
                v-for="item in department"
                :key="item.id"
                :label="item.departmentName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="可选应用" prop="appIds">
            <el-select v-model="addMemberInfo.appIds" placeholder="请选择应用" multiple style="width: 100%">
              <el-option
                v-for="item in applicationList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="sendInvite">发送邀请</el-button>
      </span>
    </el-dialog>
    <!-- 设置管理员 删除成员提示-->
    <el-dialog :visible.sync="settingMemberDialog" :show-close="false" :close-on-click-modal="false" width="480px">
      <div>
        <span class="title mb10 mt15">{{ settingMemberInfo.isAdmin?'取消':'设置' }}管理员</span>
        <div class="text mt15" style="font-size: 14px;line-height: 25px;">
          是否将用户"{{ settingMemberInfo.name }}" {{ settingMemberInfo.isAdmin?'取消':'设为' }}管理员？
        </div>
      </div>
      <span slot="footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="settingMember">确 定</el-button>
      </span>
    </el-dialog>
    <!--删除单条成员-->
    <delete-dialog :visible.sync="deleteSingleMemberDialog" :title="`确认删除'${settingMemberInfo.name}'？`" content="成员将从公司内删除，成员产生的数据将保留。" @cancel="cancelDialog" @confirm="settingMember" />
  </div>
</template>
<script>
import { searchDepartments, aplictionList, departmentAdd, departmentUpdate, departmentDelete } from '../../../api/company'
import { searchUserList, setAdminAndDelete, batchDelete, batchAppUser, addUser, checkMobile, departmentUpdateUser } from '../../../api/member'
import deleteDialog from '@/components/deleteDialog'
import XLSX from 'xlsx'
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
      applicationList: [],
      department: [],
      allMember: 0,
      unGrouped: 0, // 未分类
      isUnGrouped: false,
      activeDepartment: '', // 选中的部门的id
      isAllData: true, // 是否是全部成员
      memberList: [],
      checkedMemberList: [],
      pagination: {
        page: 1,
        size: 10
      },
      total: 0,
      showMember: false,
      // todo -------------------弹窗------------------
      settingMemberInfo: {},
      settingMemberDialog: false, // 设置管理员
      deleteSingleMemberDialog: false, // 删除一条数据
      creatDepartmentDialog: false, // 创建部门弹窗
      createDepartment: {
        newDepartment: ''
      },
      renameDepartmentDialog: false, // 重命名弹窗
      renameDepartment: { rename: '' },
      removeDepartmentInfo: {}, // 要删除部门的信息
      // deleteDepartmentDialog: false, // 删除失败弹窗
      againSureDeleteDepartmentDialog: false, // 删除部门二次确认弹窗
      removeMemberDialog: false, // 移动成员至部门弹窗
      removeMemberDepartment: null,
      deleteMemberDialog: false, // 删除成员确认框
      dispatchAppDialog: false, // 分配应用弹窗
      checkList: [],
      invite: {
        inviteMobile: ''
      },
      inviteMobileDialog: false, // 邀请员工
      addMemberDialog: false, // 添加员工
      addMemberInfo: {},
      addMemberrules: {
        name: [{ required: true, pattern: /^([\u4e00-\u9fa5][\u4e00-\u9fa5\-_~]{1,9})$|^([a-zA-Z][a-zA-Z\-_~]{2,19})$/,
          message: '请输入正确姓名', trigger: ['change', 'blur'] }],
        mobile: [{ required: true, pattern: /^1[3-9](\d{9})$/, message: '请输入正确手机号', trigger: ['change', 'blur'] }],
        // departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        email: [{ pattern: /^([a-zA-Z]|[0-9])(\w|\-|\.)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱', trigger: ['change', 'blur'] }]
      },
      // todo -------------------导入---------------
      importDialogVisible: false, // 导入员工弹窗
      xlsxJson: [], // 导入的数据
      xlsxName: '',
      memberDialog: false, // 展示成员的弹窗
      // todo -------------------批量操作--------------
      isBatch: false, // 点击批量操作
      isIndeterminate: false,
      checkAll: false, // 全选
      countTrue: 0
    }
  },
  computed: {
    bgColor(status) {
      return function(status) {
        if (status === '活跃') {
          return '#FA8C16'
        } else if (status === '禁用') {
          return '#FF5722'
        } else {
          return '#4557F6'
        }
      }
    },
    uploadHeader() {
      return {
        'x-hbb-platform': 'lumbar'
        // 'x-hbb-token': this.token,
        // 'x-hbb-user-id': getUserId(),
        // 'x-hbb-company-id': getCompanyId()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getDepartmentList()
      this.getMemberList(1)
      this.getApplictionList()
    },
    // 获取公司下的应用列表
    getApplictionList() {
      const option = {
        companyId: this.companyId
      }
      aplictionList(option).then(res => {
        this.applicationList = res.body
      })
    },
    // 获取公司下的部门
    getDepartmentList() {
      searchDepartments({ companyId: this.companyId }).then(res => {
        this.department = res.body.data || []
        this.unGrouped = res.body.unGrouped || 0
        this.allMember = res.body.allUser || 0
        this.department.forEach(item => {
          this.$set(item, 'showDialog', false)
        })
      })
    },
    // 获取成员列表
    getMemberList(type, id) {
      if (this.pagination.page < 1) {
        this.pagination.page = 1
      }
      // type 1 全部数据 ，2 根据部门  3 未分配
      const option = {
        companyId: this.companyId,
        ...this.pagination
      }
      if (type === 1) {
        option.allData = true
        this.activeDepartment = ''
        this.isAllData = true
        this.isUnGrouped = false
      } else if (type === 2) {
        option.departmentId = id
        this.activeDepartment = id
        this.isAllData = false
        this.isUnGrouped = false
      } else if (type === 3) {
        this.isUnGrouped = true
        this.activeDepartment = ''
        this.isAllData = false
      }
      searchUserList(option).then(res => {
        this.memberList = res.body.records || []
        this.total = res.body.totalRecord
        // debugger
        this.memberList.forEach(item => {
          item.applicationPower = item.appDtoList.map(m => m.name).join(' ') || '-'
          this.$set(item, 'showDialog', false)
          this.$set(item, 'checked', false)
          this.$set(item, 'statusDec', this.userStatus(item.status))
          // 保留批量的选中状态
          this.checkedMemberList.forEach(m => {
            if (m.userId === item.userId) {
              item.checked = true
            }
          })
        })
        this.showMember = true
        this.checkedChange()
      })
    },
    userStatus(key) {
      let status = ''
      switch (key) {
        case 0:
          status = '活跃'
          break
        case 1:
          status = '正常'
          break
        case 2:
          status = '未激活'
          break
        case 3:
          status = '删除'
          break
        case 4:
          status = '禁用'
          break
        case 5:
          status = '已拒绝'
          break
      }
      return status
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.page = val
      this.judgeCurrClass()
    },
    // 判断当前在部门哪个分类
    judgeCurrClass() {
      // 1 全部数据 ，2 根据部门  3 未分配
      if (this.isAllData) {
        this.getMemberList(1)
      } else {
        if (this.isUnGrouped) {
          this.getMemberList(3)
        } else {
          this.getMemberList(2, this.activeDepartment)
        }
      }
    },
    // todo-------------------------table-----------------
    // 点击更多部门icon
    showDialogDepartment(index) {
      this.department[index].showDialog = true
    },
    // 鼠标出部门 row
    hoverLeaveDepartment() {
      this.department.forEach(item => {
        item.showDialog = false
      })
    },
    // 点击更多tableicon
    showDialog(index) {
      this.memberList[index].showDialog = true
    },
    // 鼠标出table row
    hoverLeave() {
      this.memberList.forEach(item => {
        item.showDialog = false
      })
    },
    // todo------------------------------导入---------------------------
    importExcel(file) {
      this.xlsxName = file.name
      const types = file.name.split('.')[1]
      const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw'].some(item => item === types)
      if (!fileType) {
        this.$message('格式错误！请重新选择')
        return
      }
      this.file2Xce(file).then(tabJson => {
        if (tabJson && tabJson.length > 0) {
          this.xlsxJson = tabJson
          this.importDialogVisible = false
          this.memberDialog = true
        }
      })
    },
    file2Xce(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        reader.onload = function(e) {
          const data = e.target.result
          this.wb = XLSX.read(data, {
            type: 'binary'
          })
          const result = []
          this.wb.SheetNames.forEach((sheetName) => {
            result.push({
              sheetName: sheetName,
              sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
            })
          })
          resolve(result)
        }
        reader.readAsBinaryString(file.raw)
      })
    },
    // 下载模板
    downTemplate() {

    },
    // 确认导入
    confirmImport() {

    },
    // todo-----------------------------------------部门---------------
    changeDepartment(id) {
      this.pagination.page = 1
      this.getMemberList(2, id)
    },
    // 删除部门
    deleteDepartment(index) {
      // if (this.department[index].userNumber > 0) {
      //   this.openDialog('deleteDepartment')
      // } else {
        this.removeDepartmentInfo = this.department[index]
        this.openDialog('againSureDeleteDepartment')
      // }
    },
    // 确定删除部门
    comfirmDeleteDepartment() {
      const option = {
        companyId: this.companyId,
        id: this.removeDepartmentInfo.id
      }
      departmentDelete(option).then(res => {
        this.$message.success('部门已删除')
        this.cancelDialog()
        this.getDepartmentList()
      })
    },
    // 创建新部门
    confirmAdd() {
      this.$refs.addPartmentForm.validate((valid) => {
        if (valid) {
          const option = {
            companyId: this.companyId,
            departmentName: this.createDepartment.newDepartment
          }
          departmentAdd(option).then(() => {
            this.$message.success('创建成功')
            this.cancelDialog()
            this.getDepartmentList()
          })
        } else {
          return false
        }
      })
    },
    // 重命名部门确认
    confirmRename() {
      this.$refs.renameDepartment.validate((valid) => {
        if (valid) {
          const option = {
            id: this.currentDepartmentId,
            companyId: this.companyId,
            departmentName: this.renameDepartment.rename
          }
          departmentUpdate(option).then(res => {
            this.$message.success('重命名成功')
            this.getDepartmentList()
            this.cancelDialog()
          })
        } else {
          return false
        }
      })
    },
    // todo---------------------------弹窗打开关闭------------------
    // 打开弹窗
    openDialog(type, index, cType) {
      // 创建部门取消验证
      if (this.$refs['addPartmentForm'] !== undefined) {
        this.$refs['addPartmentForm'].resetFields()
      }
      switch (type) {
        case 'import':
          this.importDialogVisible = true
          break
        case 'creatDepartment':
          this.newDepartment = ''
          this.creatDepartmentDialog = true
          break
        case 'renameDepartment':
          this.currentDepartmentId = this.department[index].id
          this.renameDepartment.rename = this.department[index].departmentName
          this.renameDepartmentDialog = true
          break
        // case 'deleteDepartment':
        //   this.deleteDepartmentDialog = true
        //   break
        case 'againSureDeleteDepartment':
          this.againSureDeleteDepartmentDialog = true
          break
        case 'removeMember':
          if (!this.countTrue) {
            this.$message.error('请选择成员')
            return
          }
          this.removeMemberDepartment = ''
          this.removeMemberDialog = true
          break
        case 'deleteMember':
          if (this.judgeAdmin()) {
            this.$message.error('创建者或管理员不能删除')
            return
          }
          if (!this.countTrue) {
            this.$message.error('请选择成员')
            return
          }
          this.deleteMemberDialog = true
          break
        case 'dispatchApp':
          if (this.judgeAdmin()) {
            this.$message.error('创建者或管理员不能分配应用')
            return
          }
          if (!this.countTrue) {
            this.$message.error('请选择成员')
            return
          }
          this.checkList = []
          this.dispatchAppDialog = true
          break
        case 'inviteMobile':
          if (this.$refs['inviteForm'] !== undefined) {
            this.$refs['inviteForm'].resetFields()
          }
          this.inviteMobileDialog = true
          break
        case 'addMember':
          this.addMemberDialog = true
          break
        case 'settingMember':
          this.settingMemberInfo = this.memberList[index]
          this.settingMemberInfo.type = cType
          this.settingMemberDialog = true
          break
        case 'deleteSingleMember':
          this.settingMemberInfo = this.memberList[index]
          this.settingMemberInfo.type = cType
          this.deleteSingleMemberDialog = true
          break
      }
    },
    // 取消弹窗
    cancelDialog() {
      // 重命名
      this.renameDepartment.rename = ''
      this.renameDepartmentDialog = false
      // 创建新部门
      this.newDepartment = ''
      this.creatDepartmentDialog = false
      //
      this.memberDialog = false
      this.xlsxJson = []
      // 添加员工
      this.addMemberInfo = {}
      this.addMemberDialog = false
      // 添加员工的手机号
      this.invite.inviteMobile = ''
      this.inviteMobileDialog = false
      // 删除员工
      this.deleteMemberDialog = false
      // 批量分配应用
      this.checkList = []
      this.dispatchAppDialog = false
      // 批量移动至部门
      this.removeMemberDepartment = ''
      this.removeMemberDialog = false
      // 删除部门
      // this.deleteDepartmentDialog = false
      // 删除部门二次确认
      this.againSureDeleteDepartmentDialog = false
      // 设置管理员 删除成员
      this.settingMemberDialog = false
      // 删除单条成员
      this.deleteSingleMemberDialog = false
    },
    // todo --------------------------------------成员-------------------
    // 员工信息
    memberInfo(userId) {
      if (!this.isAdmin && !this.isCompanyCreate) return
      const path = '/' + this.$route.params.companyId + '/company/memberInfo'
      this.$router.push({ path, query: { userId }})
    },
    // 编辑员工
    memberEdit(userId) {
      const path = '/' + this.$route.params.companyId + '/company/memberEdit'
      this.$router.push({ path, query: { userId }})
    },
    // 设置管理、删除成员
    settingMember() {
      // type 1 设置取消为管理员 2 删除
      const option = {
        userId: this.settingMemberInfo.userId,
        companyId: this.companyId
      }
      if (this.settingMemberInfo.type === 1) {
        option.isAdmin = !this.settingMemberInfo.isAdmin
      } else if (this.settingMemberInfo.type === 2) {
        option.isDelete = true
      }
      setAdminAndDelete(option).then(res => {
        this.$message.success('更新成功')
        if (this.memberList.length <= 1) {
          this.pagination.page = this.pagination.page - 1
        }
        this.judgeCurrClass()
        this.getDepartmentList()
        this.cancelDialog()
      })
    },
    // 添加成员电话
    confirmInviteMobile() {
      this.$refs.inviteForm.validate((valid) => {
        if (valid) {
          const option = {
            mobile: this.invite.inviteMobile,
            checkType: 2
          }
          checkMobile(option).then(resp => {
            this.addMemberInfo = {}
            this.addMemberInfo.mobile = this.invite.inviteMobile
            if (resp.body && resp.body.name) {
              this.$set(this.addMemberInfo, 'name', resp.body.name)
            }
            this.inviteMobileDialog = false
            if (this.$refs['ruleForm'] !== undefined) {
              this.$refs['ruleForm'].resetFields()
            }
            this.addMemberDialog = true
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    // 添加成员发送邀请
    sendInvite() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const option = {
            companyId: this.companyId,
            ...this.addMemberInfo
          }
          if (!option.appIds) {
            option.appIds = []
          }
          addUser(option).then(() => {
            this.$message.success('添加成功')
            this.judgeCurrClass()
            this.getDepartmentList()
            this.cancelDialog()
          })
        } else {
          return false
        }
      })
    },
    // todo--------------------------------批量操作---------------------
    // 全选按钮
    handleCheckAllChange(val) {
      this.checkAll = val
      if (val) {
        this.memberList.map(m => m.checked = true)
      } else {
        this.memberList.map(m => m.checked = false)
      }
      this.sumCheck()
      this.isIndeterminate = false
    },
    // table 复选框
    checkedChange() {
      this.checkedMemberList = []
      this.isIndeterminate = this.memberList.some(s => s.checked === true)
      this.checkedMemberList = this.memberList.filter(s => s.checked === true)
      const allTrue = this.memberList.every(e => e.checked === true)
      const allFalse = this.memberList.every(e => e.checked === false)
      if (allTrue) {
        this.handleCheckAllChange(true)
      }
      if (allFalse) {
        this.handleCheckAllChange(false)
      }
      this.sumCheck()
    },
    // 计算选中的人数
    sumCheck() {
      // 计算选中的人数
      let count = 0
      this.memberList.forEach(item => {
        if (item.checked) {
          count += 1
        }
      })
      this.countTrue = count
    },
    judgeAdmin() {
      const isHasAdmin = this.checkedMemberList.some(s => s.isAdmin)
      return isHasAdmin
    },
    // 取消批量
    cancelBatch() {
      this.isBatch = false
      this.countTrue = 0
      this.memberList.forEach(item => { item.checked = false })
    },
    // 批量删除成员
    batchDeleteMember() {
      const option = {
        companyId: this.companyId
      }
      option.userIds = this.memberList.filter(f => f.checked === true).map(m => m.userId)
      batchDelete(option).then(res => {
        this.$message.success('删除成功')
        if (option.userIds.length >= this.memberList.length) {
          this.pagination.page = this.pagination.page - 1
        }
        this.cancelDialog()
        this.getDepartmentList()
        this.judgeCurrClass()
      })
    },
    // 批量更新应用
    batchUpdateApp() {
      const option = {
        companyId: this.companyId,
        appIds: this.checkList
      }
      const userList = this.memberList.filter(f => f.checked === true)
      option.userIds = userList.map(m => m.userId)
      batchAppUser(option).then(res => {
        this.$message.success('分配成功')
        this.cancelDialog()
        this.judgeCurrClass()
      })
    },
    // 批量移动至部门
    batchRemoveMember() {
      const option = {
        companyId: this.companyId,
        id: this.removeMemberDepartment,
        userDtoList: [],
        isRemove: false
      }
      const userList = this.memberList.filter(f => f.checked === true)
      userList.forEach(item => {
        option.userDtoList.push({
          userId: item.userId
        })
      })
      departmentUpdateUser(option).then(res => {
        this.$message.success('移动成功')
        if (userList.length >= this.memberList.length) {
          this.pagination.page = this.pagination.page - 1
        }
        this.cancelDialog()
        this.getDepartmentList()
        this.judgeCurrClass()
      })
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.title{color: rgba(0, 0, 0, 0.85);font-weight: 500;font-size: 16px;line-height: 28px;}
.cardBox{background-color: #fff;}
.card{height: 40px;line-height: 40px;padding: 0px 15px;border-right: 2px solid transparent; cursor:pointer;}
.hiddle{display: none;position: absolute;top: 0;right: 10px;}
.card:hover .hiddle{display: unset}
.card:hover .num{display: none;}
.text{color:rgba(0, 0, 0, 0.65);font-size: 12px;}
.active{color: #4557F6;background-color: #F0FAFF;border-right: 2px solid #4557F6;}
.cardBtn:hover{color: #4557F6;cursor: pointer;}
.batchBtn{line-height: 28px;font-size: 12px;color: rgba(0, 0, 0, 0.65);cursor: pointer}
.tableBox{background-color: #fff;border:1px solid #D9D9D9; }
.row{height: 72px;padding: 16px;position: relative;}
.more{position: absolute;left: -10px;top:24px;}
.imgBox{width: 40px;height: 40px;border-radius: 50%;}
.imgDefault{width: 40px;height: 40px;border-radius: 50%;font-size: 14px;color:#fff;text-align: center;line-height: 40px}
.rowLeft{display: flex; cursor: pointer; }
.row:hover{background-color: #F5F5F5;}
.rowLeftStatus{display:inline-block;font-size: 12px;color: rgba(0, 0, 0, 0.65);border: 0.5px solid #D9D9D9;padding: 0 5px;
  background-color: #F5F5F5;height: 20px;line-height: 20px;margin-right: 5px;}
.rowName{display:inline-block;font-size: 14px;color:rgba(0, 0, 0, 0.85);margin-right: 5px;}
.btnGroup{width: 168px;z-index: 999;position: absolute;right: 15px;box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);background-color:#fff;text-align: center;top:30px;cursor: pointer}
.hoverBtn{color:rgba(0, 0, 0, 0.65)}
.hoverBtn:hover{background-color: #F5F5F5;}
.paginationTotal{color:rgba(0, 0, 0, 0.65);font-size: 12px;position: absolute;margin-top: 15px;padding-left: 15px;padding-top: 10px;}
/deep/ .el-radio{display: block;line-height: 40px;}
.checkbox-group /deep/ .el-checkbox{display: block;line-height: 40px;}
/deep/ .el-radio__label{font-size: 12px;color:rgba(0, 0, 0, 0.65) }
 /deep/ .el-checkbox__label{font-size: 12px;color:rgba(0, 0, 0, 0.65) }
  .checkBox{height: 200px;overflow: hidden;overflow-y: auto}
  .noMember { margin-top:50px; }
</style>
