// 基础组件
export const basicComponents = [
  // 单行
  {
    type: 'input',
    icon: 'icondanhang',
    isDuplicated: false, // 重复校验
    options: {
      typeDesc: '单行',
      width: '120px',
      defaultValue: '',
      required: false,
      dataType: 'string',
      pattern: '',
      placeholder: '',
      customClass: '',
      disabled: false,
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      showPassword: false,
      // repeacheck:false, // 重复校验 校验唯一性 // 第一版不做
      validateType: 'maxlength', // 类型：一般:'maxlength'/姓名:'name'/邮箱:'email'/电话号码:'phone'
      maxlength: 255, // 字数限制
      authorizationList: '', // 权限列表
      help: '' // 帮助提示
    }
  },
  // 多行
  {
    type: 'textarea',
    icon: 'iconduohang',
    options: {
      typeDesc: '多行',
      width: '120px',
      defaultValue: '',
      required: false,
      disabled: false,
      pattern: '',
      placeholder: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      validateType: 'maxlength',
      maxlength: 255, // 字数限制
      authorizationList: '', // 权限列表
      help: '' // 帮助提示
    }
  },
  // 数字
  {
    type: 'number',
    icon: 'iconshuzi',
    options: {
      typeDesc: '数字',
      width: '120px',
      required: false,
      defaultValue: 0,
      unit: '',
      min: 0,
      placeholder: '',
      max: 0,
      step: 1,
      disabled: false,
      controlsPosition: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      authorizationList: '', // 权限列表
      guide: '', // 引导文字
      help: '', // 帮助提示
      // allowNegativeNumber:false, // 允许负数
      integer: false, // 整数校验,
      numericalRange: false, // 数值范围
      thousandBit: false, // 千位符
      float: 0, // 小数点位数
      controls: false // 加减步进
    }
  },
  // 日期
  {
    type: 'date',
    icon: 'iconriqi',
    options: {
      typeDesc: '日期',
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'date', // 类型 datetime 日期时间 time 时间  date 日期
      format: 'yyyy年MM月dd日',
      // formatTime:'HH:mm:ss',
      timestamp: false,
      required: false,
      width: '120px',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      step: 1, // 分钟间隔  // 1,5,15,30
      showSecond: false, // 显示秒
      authorizationList: '', // 权限列表
      help: '' // 帮助提示
    }
  },
  // 单选框
  {
    type: 'radio',
    icon: 'icondanxuan',
    options: {
      typeDesc: '单选项',
      inline: true,
      placeholder: '',
      defaultValue: '',
      showLabel: true,
      options: [
        {
          id: 1,
          value: '新选项1',
          label: '新选项1',
          color: '',
          bgColor: ''
        },
        {
          id: 2,
          value: '新选项2',
          label: '新选项2',
          color: '',
          bgColor: ''
        },
        {
          id: 3,
          value: '新选项3',
          label: '新选项3',
          color: '',
          bgColor: ''
        }
      ],
      required: false,
      width: '360px',
      remote: false,
      remoteType: 'option',
      remoteOption: '',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      disabled: false,
      isSelect: 0, // 是否下拉框
      allowOthers: false, // 允许其他选项
      authorizationList: '', // 权限列表
      help: '' // 帮助提示
    }
  },
  // 复选框
  {
    type: 'checkbox',
    icon: 'iconfuxuankuang',
    options: {
      typeDesc: '复选项',
      inline: true,
      defaultValue: [],
      placeholder: '',
      showLabel: true,
      options: [
        {
          id: 1,
          value: '新选项1',
          label: '新选项1',
          color: '',
          bgColor: ''
        },
        {
          id: 2,
          value: '新选项2',
          label: '新选项2',
          color: '',
          bgColor: ''
        },
        {
          id: 3,
          value: '新选项3',
          label: '新选项3',
          color: '',
          bgColor: ''
        }
      ],
      required: false,
      width: '',
      remote: false,
      remoteType: 'option',
      remoteOption: '',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      isSelect: 0,
      remoteFunc: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      disabled: false,
      authorizationList: '', // 权限列表
      help: '' // 帮助提示
    }
  },
  // 成员
  {
    type: 'member',
    icon: 'iconmember',
    isDuplicated: false, // 重复校验
    options: {
      typeDesc: '成员',
      defaultValue: '',
      multiple: 0,
      memberRange: { departmentIds: [], userIds: [] },
      width: '120px',
      required: false,
      isDuplicated: false,
      disabled: false,
      placeholder: '',
      isFilterMember: false,
      isHoverDetail: false,
      authorizationList: '', // 权限列表
      help: '' // 帮助提示

    }
  },
  // 图片
  {
    type: 'imgupload',
    icon: 'iconimage',
    options: {
      typeDesc: '图片',
      defaultValue: [],
      size: {
        width: 100,
        height: 100
      },
      width: '', // 样式
      placeholder: '', // 引导文字
      help: '', // 帮助提示
      authorizationList: '', // 权限列表
      required: false, // 验证
      tokenFunc: 'funcGetToken',
      disabled: false,
      limit: 5, // 上传数量
      fileSize: 50, // 文件大小
      multiple: true,
      min: 0,
      isEdit: false,
      action: 'http://{bucket-upload}.oss-cn-shanghai.aliyuncs.com',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true
    }
  },
  // 附件
  {
    type: 'fileupload',
    icon: 'iconattachment',
    options: {
      typeDesc: '附件',
      defaultValue: [],
      width: '360px', // 样式
      placeholder: '', // 引导文字
      help: '', // 帮助提示
      authorizationList: '', // 权限列表
      required: false, // 验证
      limit: 5, // 上传数量
      fileSize: 50, // 文件大小
      tip: '',
      action: '',
      customClass: '',
      disabled: false,
      fileList: [],
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true
    }
  },
  // 开关
  {
    type: 'switch',
    icon: 'iconswitch',
    options: {
      typeDesc: '开关',
      defaultValue: 0,
      required: false,
      disabled: false,
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      authorizationList: '', // 权限列表
      help: '' // 帮助提示
    }
  },
  // 自编号
  {
    type: 'autonumber',
    icon: 'iconlist',
    options: {
      typeDesc: '自编号',
      width: '120px',
      disabled: false,
      autoNumberPrefix: '', // 自编号前缀
      autoNumberValue: 0, // 自编号起始值
      authorizationList: '', // 权限列表
      help: '' // 帮助提示
    }
  }

  // {
  //   type: 'text',
  //   icon: 'icon-wenzishezhi-',
  //   options: {
  //     defaultValue: 'This is a text',
  //     customClass: '',
  //     labelWidth: 100,
  //     isLabelWidth: false,
  //     hidden: false,
  //     dataBind: true
  //   }
  // },
  // {
  //   type: 'rate',
  //   icon: 'icon-pingfen1',
  //   options: {
  //     defaultValue: null,
  //     max: 5,
  //     disabled: false,
  //     allowHalf: false,
  //     required: false,
  //     customClass: '',
  //     labelWidth: 100,
  //     isLabelWidth: false,
  //     hidden: false,
  //     dataBind: true,
  //     showScore: false
  //   }
  // },
  // {
  //   type: 'color',
  //   icon: 'icon-color',
  //   options: {
  //     defaultValue: '',
  //     disabled: false,
  //     showAlpha: false,
  //     required: false,
  //     customClass: '',
  //     labelWidth: 100,
  //     isLabelWidth: false,
  //     hidden: false,
  //     dataBind: true
  //   }
  // },
  // {
  //   type: 'select',
  //   icon: 'icon-select',
  //   options: {
  //     defaultValue: '',
  //     multiple: false,
  //     disabled: false,
  //     clearable: false,
  //     placeholder: '',
  //     required: false,
  //     showLabel: false,
  //     width: '',
  //     options: [
  //       {
  //         value: 'Option 1'
  //       },
  //       {
  //         value: 'Option 2'
  //       },{
  //         value: 'Option 3'
  //       }
  //     ],
  //     remote: false,
  //     remoteType: 'option',
  //     remoteOption: '',
  //     filterable: false,
  //     remoteOptions: [],
  //     props: {
  //       value: 'value',
  //       label: 'label'
  //     },
  //     remoteFunc: '',
  //     customClass: '',
  //     labelWidth: 100,
  //     isLabelWidth: false,
  //     hidden: false,
  //     dataBind: true
  //   }
  // },
  // {
  //   type: 'time',
  //   icon: 'iconshijian',
  //   options: {
  //     defaultValue: '',
  //     readonly: false,
  //     disabled: false,
  //     editable: true,
  //     clearable: true,
  //     placeholder: '',
  //     startPlaceholder: '',
  //     endPlaceholder: '',
  //     isRange: false,
  //     arrowControl: true,
  //     format: 'HH:mm:ss',
  //     required: false,
  //     width: '',
  //     customClass: '',
  //     labelWidth: 100,
  //     isLabelWidth: false,
  //     hidden: false,
  //     dataBind: true,
  //     authorizationList:[],  // 权限列表
  //     guide:'',  // 引导文字
  //        help: ''   // 帮助提示
  //   }
  // },
]
// 高级组件
export const advanceComponents = [
  // 区段
  {
    type: 'grid',
    icon: 'iconquduan',
    columns: {
      list: []
    },
    options: {
      typeDesc: '区段',
      isShowName: true, // 是否显示名称
      linkID: '', //  链接ID
      gutter: 0,
      justify: 'start',
      align: 'top',
      customClass: '',
      hidden: false
    }
  },
  // 分页
  {
    type: 'paging',
    icon: 'iconstep',
    columns: {
      list: []
    },
    options: {
      typeDesc: '分页',
      isShowName: true, // 是否显示名称
      linkID: '', //  链接ID
      customClass: '',
      hidden: false,
      LazyLoad: false
    }
  },
  // 富文本
  {
    type: 'editor',
    icon: 'iconrich_text',
    options: {
      typeDesc: '富文本',
      width: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      customToolbarVisible: true,
      customToolbar: ['0'],
      rows: 10,
      help: '',
      placeholder: '',
      required: false,
      wordLimit: false,
      validateType: 'maxlength', // 类型：一般:'maxlength'/姓名:'name'/邮箱:'email'/电话号码:'phone'
      maxlength: 255 // 字数限制
    }
  },
  // HTML
  {
    type: 'html',
    icon: 'iconhtml',
    options: {
      typeDesc: 'HTML',
      defaultValue: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      help: ''
    }
  },
  // 关联选项
  {
    type: 'relatedChoice', // 关联选项
    icon: 'iconguanlianxuanxiang',
    isDuplicated: false,
    options: {
      typeDesc: '关联选项',
      choiceType: 'multiple', // multiple 表示多选，single
      formId: '', // 关联的表单id
      field: [], // 显示字段id
      filterVisible: false, // 删选过滤器是否可见
      filter: [], // 筛选，数组中套数组[[{field:'1',op:'lt',}{}],[{},{}]],内层数组是且，外层数组是或,操作，gt,ge lt le eq
      optionAdd: false, // 是否新增选项，true允许新增，false不允许新增选项
      optionAddBtnTxt: '', // 新增选项按钮文字
      sort: 'asc', // 排序规则，asc，首字段升序，desc，首字段降序
      required: false,
      placeholder: '',
      defaultValue: '',
      showInput: false,
      range: false,
      width: '360px',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true
    }
  },
  // 关联表单
  {
    type: 'relatedForm', // 关联表单
    icon: 'iconzibiaodan',
    options: {
      typeDesc: '关联表单',
      placeholder: '', // 说明文字
      formId: '', // 关联的表单id
      header: [], // 表单头部列表
      help: '', // 帮助提示
      min: 0,
      max: 100,
      defaultSizeVisible: false,
      defaultSize: 1,
      maxSizeVisbile: false,
      maxSize: 10,
      step: 1,
      showInput: false,
      range: false,
      width: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true
    }
  },
  // 地理区域
  {
    type: 'cascader',
    icon: 'icondizhi',
    options: {
      typeDesc: '地理区域',
      defaultValue: [],
      width: '120px',
      placeholder: '',
      disabled: false,
      clearable: false,
      remote: true,
      remoteType: 'option',
      remoteOption: '',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      required: false,
      type: '国家-地区-城市', // 类型
      authorizationList: '', // 权限列表
      help: '' // 帮助提示

    }
  }
  // {
  //   type: 'table',
  //   icon: 'iconzibiaodan',
  //   options: {
  //     defaultValue: [],
  //     customClass: '',
  //     labelWidth: 100,
  //     isLabelWidth: false,
  //     hidden: false,
  //     dataBind: true,
  //     disabled: false,
  //   },
  //   tableColumns: []
  // },
  // {
  //   type: 'blank',
  //   icon: 'iconquduan',
  //   options: {
  //     defaultType: 'String',
  //     customClass: '',
  //     width: '',
  //     labelWidth: 100,
  //     isLabelWidth: false,
  //     hidden: false,
  //     dataBind: true,
  //     selectForm:'', // 选择表单
  //     linkForm:'' // 关联表单
  //   }
  // },
]
// 布局组件
export const layoutComponents = [
  // {
  //   type: 'grid',
  //   icon: 'icon-RectangleCopy',
  //   columns: [
  //     {
  //       span: 12,
  //       list: []
  //     },
  //     {
  //       span: 12,
  //       list: []
  //     }
  //   ],
  //   options: {
  //     gutter: 0,
  //     justify: 'start',
  //     align: 'top',
  //     customClass: '',
  //     hidden: false,
  //   }
  // },
  // {
  //   type: 'tabs',
  //   icon: 'icon-tabs',
  //   tabs: [
  //     {
  //       label: 'Tab 1',
  //       name: 'tab_1',
  //       list: []
  //     }
  //   ],
  //   options: {
  //     type: '',
  //     tabPosition: 'top',
  //     customClass: '',
  //     hidden: false,
  //   }
  // },
  // {
  //   type: 'divider',
  //   icon: 'icon-fengexian',
  //   options: {
  //     hidden: false,
  //     contentPosition: 'left'
  //   }
  // }
]
// 列表
export const listComponents = [
  {
    type: 'header',
    icon: '',
    fieldColumn: 1,
    fieldRow: 1,
    options: {
      operationList: [
        {
          operationType: 'listQuery',
          icon: 'iconsearch--line'
        },
        {
          operationType: 'add',
          icon: 'iconadd-line'
        }
        // {
        //   operationName: '过滤',
        //   operationType:'customize',
        //   icon:'iconri-filter-line'
        // }
      ],
      batchList: [ // 批量操作
        {
          operationType: 'batchEdit',
          icon: 'iconri-edit-line'
        },
        {
          operationType: 'batchDelete',
          icon: 'iconri-delete-bin--line'
        }
      ]

    }
  },
  {
    type: 'list',
    icon: '',
    fieldColumn: 1,
    fieldRow: 2,
    options: {
      defaultSort: {
        prop: '', // 排序依据
        order: '' // false 升序 true 降序
      },
      fixHeader: false, // 固定表头
      content: [] // 表头内容
    }
  },
  {
    type: 'operation',
    icon: '',
    fieldColumn: 2,
    fieldRow: 2,
    options: {
      fix: 'right', // right右侧固定  hidden 隐藏到右键
      operationList: [
        {
          operationType: 'detailQuery',
          operationName: '查看',
          icon: 'iconsearch--line'
        },
        {
          operationName: '编辑',
          operationType: 'detailEdit',
          icon: 'iconri-edit-line'
        },
        {
          operationName: '删除',
          icon: 'iconri-delete-bin--line',
          operationType: 'detailDelete'
        }
      ]
    }
  },
  {
    type: 'footer',
    icon: '',
    fieldColumn: 1,
    fieldRow: 3,
    options: {
      size: 20
    }
  },
  {
    type: 'preview',
    icon: '',
    fieldColumn: 1,
    fieldRow: 4,
    options: {
      operationList: [
        {
          operationName: '编辑',
          operationType: 'detailEdit',
          icon: 'iconri-edit-line'
        },
        {
          operationName: '复制',
          operationType: 'detailCopy',
          icon: 'iconcopy'
        },
        {
          operationName: '删除',
          icon: 'iconri-delete-bin--line',
          operationType: 'detailDelete'
        }

      ],
      content: []
    }
  }

]
