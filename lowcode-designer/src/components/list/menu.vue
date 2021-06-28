<template>
  <div class="menuPage">
    <h3 class="menuTitle">
      <span class="pageText">页面</span>
      <el-tooltip class="item" effect="dark" content="点击『添加』，为项目添加一组新页面" placement="right">
        <span class="btnAdd" @click="createListPage"><i class="iconfont iconadd-line"/>添加</span>
      </el-tooltip>
    </h3>
    <el-main class="menuList">
      <el-scrollbar class="default-scrollbar">
        <div class="navMenu">
          <draggable
            v-model="menuPageChild"
            v-bind="{
              disabled: false,
              group:'menu',
              forceFallback: true,
              fallbackClass: 'ghostMenu',
              animation: 200,
              filter:'.subMenu'
            }"
            class=""
            @start="dragStart"
            @update="handleDrag"
          >
            <dl v-for="(navItem, navIndex) in menuPageChild" :key="navIndex" :index="navIndex+''">
              <dt :class="{curr: navItem.active}" @mouseenter="mouseoverNavFn(navItem)" @mouseleave="mouseoutNavFn(navItem)" @click="slideUpDown(navItem)">
                <!-- 主菜单展示隐藏ICON -->
                <i :class="['iconfont', 'iconarrow-right-s-fill', navItem.iconFlag == true ? 'showSubmenu' : '']" class="cursor-p"/>
                <!-- 主菜单编辑输入框 -->
                <el-input v-if="navItem.editFlag" v-model="navItem.pageTemplateName" style="width:150px; border:none;" @blur="navMenuBlur(navItem)" />
                <!-- 主菜单标题 -->
                <span :title="navItem.pageTemplateName" class="navMenuName text-ellipsis">{{ navItem.pageTemplateName }}</span>
                <i v-if="navItem.navFlag" class="iconfont iconri-delete-bin--line  btnNavDel" @click.stop="removeNavMenu(navItem)"/>
              </dt>
              <dd v-if="navItem.iconFlag">
                <!--<draggable-->
                <!--v-bind="{-->
                <!--disabled: false,-->
                <!--group:'menuChild',-->
                <!--forceFallback: true,-->
                <!--fallbackClass: 'ghostMenu',-->
                <!--animation: 200,-->
                <!--draggable:'.subMenu'-->
                <!--}"-->
                <!--v-model="navItem.subMenu">-->
                <div v-for="(subItem, subIndex) in navItem.subMenu" :key="showIndex(navIndex, subIndex)" :index="showIndex(navIndex, subIndex)" :class="['subMenu', {curr: subItem.active}]" @mouseenter="mouseoverFn(subItem)" @mouseleave="mouseoutFn(subItem)" @click="toggleSubMenu(subIndex)" >
                  <!-- 子菜单外链ICON -->
                  <i v-if="subItem.subLink" class="iconfont iconri-link btnSubMenuLink"/>
                  <!-- 子菜单标题 -->
                  <span :title="subItem.pageTemplateName" class="subMenuName text-ellipsis" @click.stop="showComponent(subItem, navItem.subMenu)">{{ subItem.pageTemplateName }}</span>
                  <!-- 子菜单编辑输入框 -->
                  <el-input v-if="subItem.editFlag" v-model="subItem.pageTemplateName" @blur="subMenuBlur(subItem)" />
                </div>
                <!--</draggable>-->
              </dd>
            </dl>
          </draggable>
        </div>
      </el-scrollbar>

    </el-main>
    <delete-dialog :visible.sync="deletedShow" title="删除页面" @confirm="sureDelete"/>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import { formPageUpdate, formFieldList, formFieldAdd, menuMove, menuExchange } from '@/api/builder'
import { getOperations } from '@/api/list'
import { authorityPageDelete } from '@/api/permission'
import { getCompanyId, getAppId } from '@/util/auth'
import { listComponents } from '@/components/form/componentsConfig.js'
import deleteDialog from '@/components/deleteDialog/'
export default {
  name: 'MenuPage',
  components: {
    Draggable,
    deleteDialog
  },
  props: {
    formAdd: {
      type: Boolean,
      default: false
    },
    // 接收组件<menu-page> v-model的传值，必须是value
    value: {
      type: Array,
      default: function() {
        return []
      }
    },
    curPageData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      oldValue: [],
      showSubmenuFlag: false,
      currIndex: null,
      // menuPageChild: this.value, // 拖拽定义绑定数据，接收传过来的值
      deletedShow: false,
      deljsonData: null
    }
  },
  computed: {
    menuPageChild: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    curPageData: {
      // deep: true,
      handler(val) {
        val.templateDataId && this.value.forEach((m, index) => {
          val.templateDataId === m.templateDataId && this.$set(this.value, index, val)
          m.subMenu && m.subMenu.forEach((n, dIndex) => {
            val.templateDataId === n.templateDataId && this.$set(m.subMenu, dIndex, val)
          })
        })
      }
    }
  },
  methods: {
    dragStart(el) {
      this.oldValue = [...this.menuPageChild]
    },
    // 拖拽页面
    async handleDrag(el) {
      const newVal = this.menuPageChild
      const oldVal = this.oldValue
      const oldIndex = el.oldIndex
      const newIndex = el.newIndex
      const templateDataId = newVal[newIndex].templateDataId
      if (Math.abs(oldIndex - newIndex) === 1) {
        const obj = {
          templateDataId,
          exchangeTemplateDataId: newVal[oldIndex].templateDataId
        }
        await menuExchange(obj)
      } else {
        const obj = {
          templateDataId,
          parentTemplateSort: newIndex > oldIndex ? oldVal[newIndex].parentTemplateSort + 1 : oldVal[newIndex].parentTemplateSort
        }
        await menuMove(obj)
      }
    },
    // todo -- 主菜单 --
    // 主菜单编辑
    editNavMenu(item) {
      item.editFlag = true
    },
    // 主菜单失去焦点保存
    navMenuBlur(item) {
      item.editFlag = false
      this.modifyMenu(item)
    },
    modifyMenu(item) {
      const jsonData = {
        templateDataId: item.templateDataId,
        pageTemplateName: item.pageTemplateName,
        pageTemplateSort: item.pageTemplateSort
      }
      formPageUpdate(jsonData).then(res => {
        if (res.code === 200) {
          this.$message.success('修改成功')
          this.$emit('init')
        }
      })
    },
    // 主菜单显示图标
    mouseoverNavFn(item) {
      item.navFlag = true
    },
    // 主菜单显示图标
    mouseoutNavFn(item) {
      item.navFlag = false
    },
    // 主菜单展开收起
    slideUpDown(item) {
      this.menuPageChild.forEach(i => {
        if (i !== item) {
          this.$set(i, 'iconFlag', false)
        } else {
          this.$set(item, 'iconFlag', !item.iconFlag)
        }
      })
      // this.$set(item, 'iconFlag', !item.iconFlag)
      this.setStorageAndAttribute(item)
      item.subMenu.forEach(m => {
        this.$set(m, 'active', false)
        this.$set(m, 'subFlag', false)
        this.$set(m, 'editFlag', false)
        this.$set(m, 'subLink', false)
      })
      this.$emit('update:isFirstMenu', true)
    },
    // 主菜单删除
    removeNavMenu(item) {
      this.deljsonData = {
        templateDataId: item.templateDataId,
        pageTemplateStatus: 0
      }
      this.deletedShow = true
    },
    // 确定删除
    sureDelete() {
      formPageUpdate(this.deljsonData).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.deletedShow = false
          const jsonData = {
            companyId: getCompanyId(),
            appId: getAppId(),
            pageId: this.deljsonData.templateDataId
          }
          authorityPageDelete(jsonData)
          this.$emit('init')
        }
      })
    },
    // todo -- 子菜单 --
    // 子菜单显示图标
    mouseoverFn(item) {
      item.subFlag = true
    },
    // 子菜单隐藏图标
    mouseoutFn(item) {
      item.subFlag = false
    },
    // 子菜单编辑
    editSubMenu(item) {
      item.editFlag = true
    },
    // 子菜单失去焦点保存
    subMenuBlur(item) {
      item.editFlag = false
      this.modifyMenu(item)
    },
    // 子菜单添加外链
    addSubMenuLink(navIndex) {
      this.value[navIndex].subMenu.push(
        {
          subLink: 'true', // 判断是否为外链
          subType: 'formPage',
          subName: '详情页连接',
          subFlag: false,
          editFlag: false
        }
      )
    },
    // 子菜单外链删除
    removeSubMenuLink(navIndex, subIndex) {
      this.value[navIndex].subMenu.splice(subIndex, 1)
    },
    showIndex(navIndex, subIndex) {
      return navIndex + '-' + subIndex
    },
    //  处理选中样式
    dealSelectMenu(item) {
      this.value.forEach(m => {
        if (item.templateDataId === m.templateDataId) {
          m.active = true
        } else {
          m.active = false
        }
        m.subMenu && m.subMenu.forEach(n => {
          if (item.templateDataId === n.templateDataId) {
            n.active = true
          } else {
            n.active = false
          }
        })
      })
    },
    // 添加页面或者添加表单
    createListPage() {
      this.$emit('changeFormAdd', true)
    },
    setStorageAndAttribute(item) {
      item.active = true
      this.dealSelectMenu(item)
      this.$emit('setCurPageData', item)
      this.$emit('modifyConfigTab', 'page')
      this.$emit('showComponentOrContent', item)
    },
    // 点击子菜单显示组件和选择列表内容
    async showComponent(subItem, pageArr) {
      const listData = pageArr.find(item => item.pageType === 2)
      this.$emit('update:curFormData', pageArr.find(item => item.pageType === 1))
      this.$emit('update:switchPageLoading', true)
      this.$emit('update:isFirstMenu', false)
      const list = await formFieldList(listData.templateDataId)
      // subItem.pageType === 1 去掉了
      if (!list.body.length && !subItem.isInited) {
        let defaultDataKey = ''
        const data = listComponents
        const result = await formFieldAdd({
          ...data[0],
          templateDataId: listData.templateDataId
        })
        defaultDataKey = result.body.parentDataKey
        const arr = [
          formFieldAdd({
            ...data[1],
            parentDataKey: defaultDataKey,
            templateDataId: listData.templateDataId
          }),
          formFieldAdd({
            ...data[2],
            parentDataKey: defaultDataKey,
            templateDataId: listData.templateDataId
          }),
          formFieldAdd({
            ...data[3],
            parentDataKey: defaultDataKey,
            templateDataId: listData.templateDataId
          }),
          formFieldAdd({
            ...data[4],
            parentDataKey: defaultDataKey,
            templateDataId: listData.templateDataId
          })
        ]
        await Promise.all(arr)
        subItem.isInited = true
      }
      // 获取对应的表单(列表)数据
      const res = await formFieldList(subItem.templateDataId)
      this.$emit('dealMenuClick', res.body, subItem.pageType)

      if (subItem.pageType === 2) {
        const resp = await getOperations(subItem.templateDataId)
        this.$emit('dealMenuClick', resp.body, subItem.pageType, true)
      }
      this.$emit('update:switchPageLoading', false)
      this.setStorageAndAttribute(subItem)
    },
    // 子菜单选择当前菜单
    toggleSubMenu(index) {
      this.currIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
  /* menuPage */
  .menuPage  { margin-bottom:10px; border-bottom:1px solid #E8E8E8; background-color:#ffffff; }
  .menuList  { height:220px;

 }
  .menuTitle { height:40px; font-size:14px; font-weight:normal; line-height:40px; margin:0; padding:0 10px; }
  .pageText  { float:left; font-weight:bold; }
  .btnAdd    { float:right; margin-top:5px; width:54px; height:26px; text-align:center; line-height:26px;  border-radius:10px; cursor:pointer; border:1px solid #ffffff; color:#232E37; }
  .btnAdd:hover { border:1px solid #0097FF; }

  dl,dt,dd { margin:0; padding:0; }
  .navMenu { margin:0 10px; }
  .navMenu dl { margin-top:5px; }
  .navMenu dl dt { padding:0 50px 0 20px; height:32px; line-height:32px; position:relative; }
  .navMenu dl dt:hover, .navMenu .subMenu:hover, .navMenu .curr {  background:#F8F9FA; }
  .navMenu .navMenuName { display:block; font-size:12px; font-weight:bold; cursor:pointer; }
  .iconarrow-right-s-fill { transition:all 0.2s ease-in-out; margin-right:3px; color:#333333; position:absolute; left:0; top:0; }
  .showSubmenu { transform:rotate(90deg); position:absolute; }
  .btnNavEidt,.btnNavDel { font-size:12px; position:absolute; top:0; z-index:3; color:#A9AFB5; }
  .btnNavEidt { right:30px; }
  .btnNavDel { right:5px; cursor: pointer}
  .navMenu .subMenu { margin:2px 0; padding:0 60px 0 34px; height:32px; line-height:32px; position:relative; font-size:12px; cursor: pointer; }
  .btnSubEidt,.btnSubList,.btnSubMenuLink { font-size:12px; position:absolute; top:0; z-index:3; color:#A9AFB5; }
  .btnSubEidt { right:30px; }
  .btnSubList { right:5px; }
  .btnSubMenuLink { left:3px; }
  .navMenu .subMenuName { display:block; cursor:pointer; }
  .cursor-p {cursor: pointer}
  .text-ellipsis {overflow: hidden; white-space: nowrap;text-overflow: ellipsis;}
</style>

