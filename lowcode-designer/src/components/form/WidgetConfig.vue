<template>
  <div v-if="show" class="widgetConfigWrap">
    <el-form :model="data" :rules="rules" label-position="top" size="small">
      <!-- todo 表单 *** -->
      <div v-if="muneType=='formPage'">
        <!--名称-->
        <el-form-item v-if="data.type != 'tabs'" :label="$t('fm.config.widget.name')" class="pb10" prop="name">
          <el-input v-model.trim="data.name" placeholder="请输入内容" @blur="saveName"/>
        </el-form-item>
        <el-form-item v-if="data.type === 'grid'">
          <el-checkbox v-model="data.options.isShowName" @change="saveFormData">显示区段名称</el-checkbox>
        </el-form-item>
        <el-form-item v-if="data.type === 'grid'" label="链接ID" class="mt10">
          <el-input v-model="data.options.linkID" placeholder="请输入内容" @blur="saveFormData"/>
        </el-form-item>
        <!--标识-->
        <el-form-item v-if="(data.type!='blank' && data.type !== 'grid')" :label="$t('fm.config.widget.model')">
          <el-input v-model.trim="data.dataKey" disabled @blur="saveFormData"/>
        </el-form-item>
        <!-- 关联组件 -->
        <div v-if="data.type === 'relatedChoice'">
          <h3 class="navTitle"><span>显示字段</span><span class="relatedChoiceFormName">{{ relatedChoiceFormName }}</span></h3>
          <!-- 标识 -->
          <el-form-item>
            <template v-for="field in data.options.field" >
              <el-row>
                <el-col :span="20">
                  <el-select :value="field" placeholder="选择字段" style="margin-top: 5px" @change="relatedFieldOptionChange($event,field)">
                    <el-option
                      v-for="item in relatedChoiceFieldOptions"
                      v-show="item.type !=='grid' && item.type !=='paging' && !getRelatedChoiceDisabled(item.fieldId, field)"
                      :key="item.fieldId"
                      :label="item.name"
                      :value="item.fieldId"
                      :disabled="fieldOptionDisabled(item)">
                      <div class="flex-between">
                        <span>{{ item.name }}</span>
                        <span class="inline ml30" style="color: #8492a6; font-size: 12px">{{ showFieldType(item) }}</span>
                      </div>
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                <i v-if="data.options.field.length>1" class="el-icon-close removeFields" @click="removeRelatedChoiceOption(field.fieldId)"/></el-col>
              </el-row>
            </template>
            <el-row style="margin-top: 5px" >

              <div v-if="data.options.field.length === relatedChoiceFieldOptions.filter(item => item.choiceOptional).length">
                <el-tooltip class="item" effect="dark" content="无更多可选字段" placement="top-start">
                  <span style="font-size: 12px;color:#C0C4CC;cursor: pointer">+ 添加字段</span>
                </el-tooltip>
              </div>
              <el-button v-else icon="el-icon-plus" type="text" @click="relatedChoiceFieldDialog = true">添加字段</el-button>

            </el-row>
          </el-form-item>

          <!-- 预览 -->
          <div class="preview">
            <h3 class="navTitle">预览</h3>
            <div style="padding:5px 0 0; font-size:12px; color:#232E37;" v-text="relatedChoicePreview">姓名（电话，班级）</div>
          </div>

          <!-- 选项 -->
          <div class="option">
            <h3 class="navTitle">选项</h3>
            <!-- 选项类型 -->
            <el-form-item :label="$t('fm.config.widget.relatedFormChoiceType')" class="pb10" style="margin-top: 5px; color: #A9A9A9">
              <el-select v-model="data.options.choiceType" disabled @change="saveFormData">
                <el-option key="multiple" label="多选" value="multiple" />
                <el-option key="single" label="单选" value="single" />
              </el-select>
            </el-form-item>
            <!-- 排序规则 -->
            <el-form-item :label="$t('fm.config.widget.relatedFormChoiceSortRule')" class="pb10" style="margin-top: 5px">
              <el-select v-model="data.options.sort" @change="saveFormData">
                <el-option key="asc" label="首字段排序" value="asc" />
                <el-option key="desc" label="首字段降序" value="desc" />
              </el-select>
            </el-form-item>
            <!-- 允许新增选项 -->
            <el-form-item>
              <el-checkbox v-model="data.options.optionAdd" @change="saveFormData">{{ $t('fm.config.widget.relatedFormChoiceOptionAdd') }}	</el-checkbox>
            </el-form-item>
            <el-form-item v-if="data.options.optionAdd" :label="$t('fm.config.widget.relatedFormChoiceOptionBtnTxt')" class="pb10" style="margin-top: 5px">
              <el-input v-model="data.options.optionAddBtnTxt" placeholder="新增选项按钮文字" @blur="saveFormData"/>
            </el-form-item>
            <!-- 筛选过滤器 -->
            <el-form-item>
              <el-checkbox v-model="data.options.filterVisible" @change="filterChange">筛选过滤器</el-checkbox>
            </el-form-item>
            <el-form-item v-if="data.options.filterVisible" style="margin-top: 12px">
              <div style="display: flex;justify-content: space-between; background-color: ghostwhite">
                <el-button type="text" @click="relatedFormFilterDialogOpen" v-text="relatedChoiceConditionNum"/>
                <i class="el-icon-arrow-right" style="margin-top: 5px"/>
              </div>
            </el-form-item>
            <!-- 筛选弹窗 -->
            <el-dialog
              :visible.sync="relatedFormFilterDialog.visible"
              title="筛选过滤器"
              width="730px">
              <el-form ref="relatedFormFilterData" :model="relatedFormFilterDialog.formData" label-position="left" style="margin:0 10px;">
                <filter-condition v-if="relatedFormFilterDialog.visible" :is-current-info="true" :target-form-page-id="relatedFormFilterDialog.formPageId" :current-form-page-id="relatedFormFilterDialog.formPageId" :target-fields-list="currentFieldsList" :form-data="relatedFormFilterDialog.formData" from="currentForm" @clearValidate="clearValidate"/>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="relatedFormFilterDialogConfirm">保存</el-button>
                <el-button @click="relatedFormFilterDialogClose">取 消</el-button>
              </span>
            </el-dialog>
          </div>

        </div>
        <!-- 关联表单 -->
        <div v-if="data.type === 'relatedForm'">
          <!-- 表单内容 -->
          <h3 class="navTitle"><span>表单内容</span><span class="relatedChoiceFormName">{{ relatedFormName }}</span></h3>
          <!-- 配置表头 -->
          <el-form-item label="配置表头" style="margin-top: 12px">
            <div style="display: flex;justify-content: space-between; background-color: ghostwhite">
              <el-button type="text" @click="relatedFormHeaderDialogOpen"> {{ relatedFormHeaderShow }} </el-button>
              <i class="el-icon-arrow-right" style="margin-top: 5px"/>
            </div>
          </el-form-item>
          <!-- 允许新增选项 -->
          <el-form-item>
            <el-checkbox v-model="data.options.defaultSizeVisible" @change="saveFormData">默认记录数</el-checkbox>
          </el-form-item>
          <el-form-item v-if="data.options.defaultSizeVisible" class="pb10" style="margin-top: 5px">
            <el-input-number :controls="false" :min="1" v-model="data.options.defaultSize" placeholder="默认记录数" @blur="saveFormData"/>
          </el-form-item>
          <!-- 最大记录数 -->
          <el-form-item>
            <el-checkbox v-model="data.options.maxSizeVisbile" @change="saveFormData">最大记录数</el-checkbox>
          </el-form-item>
          <el-form-item v-if="data.options.maxSizeVisbile" class="pb10" style="margin-top: 5px">
            <el-input-number :controls="false" :min="1" :max="100" v-model="data.options.maxSize" placeholder="最大记录数" @blur="saveFormData"/>
          </el-form-item>

        </div>
        <!--类型-->
        <el-form-item v-if="data.type == 'date' || data.type == 'cascader' " :label="$t('fm.config.widget.showType')">
          <template v-if="data.type == 'date'">
            <el-select v-model="data.options.type" @change="handleDateChange">
              <el-option value="date" label="仅日期"/>
              <!--<el-option value="time" label="仅时间"></el-option>-->
              <el-option value="datetime" label="日期时间"/>
            </el-select>
          </template>
          <template v-else>
            <el-select v-model="data.options.type" @change="handleCascaderChange">
              <el-option value="国家-地区-城市"/>
              <el-option value="地区-城市"/>
              <el-option value="地区-城市-区县"/>
            </el-select>
          </template>

        </el-form-item>

        <!-- 禁止编辑 -->
        <el-form-item v-if="showFlag('disabled')">
          <el-checkbox v-if="data.type !== 'autonumber'" v-model="data.options.disabled" @change="saveFormData">{{ $t('fm.config.widget.disabled') }}	</el-checkbox>
          <el-checkbox v-if="data.type === 'autonumber'" :value="true" disabled>{{ $t('fm.config.widget.disabled') }}	</el-checkbox>
        </el-form-item>

        <!-- 图片，附件限制 -->
        <div v-if="showFlag('fileSize') || showFlag('limit')" class="imgupload">
          <h3 class="navTitle">限制</h3>
          <ul class="imgNumber">
            <li>
              <span>上传数量</span>
              <i>小于等于<el-input-number v-model="data.options.limit" :controls="false" :max="20" class="inputNumber" @blur="limitChange" />个</i>
            </li>
            <li>
              <span v-if="data.type === 'imgupload'">图片大小</span>
              <span v-else-if="data.type === 'fileupload'">文件大小</span>
              <i>小于等于<el-input-number v-model="data.options.fileSize" :controls="false" :max="data.type === 'imgupload'?20:100" class="inputNumber" @blur="fileSizeChange" />MB</i>
            </li>
          </ul>
        </div>

        <!-- 自编号 - 内容 -->
        <div v-if="showFlag('autoNumberPrefix')" class="autoNumber">
          <h3 class="navTitle">内容</h3>
          <el-form-item label="前缀">
            <el-input v-model="data.options.autoNumberPrefix" :disabled="true"/>
          </el-form-item>
          <el-form-item label="起始值">
            <el-input v-model="data.options.autoNumberValue" :disabled="true"/>
          </el-form-item>
        </div>
        <el-form-item v-if="showFlag('customToolbarVisible')" style="position: relative;">
          <template>
            <h3 class="navTitle">选项</h3>
            <el-checkbox v-model="data.options.customToolbarVisible" @change="saveToolbar">工具栏选项</el-checkbox>
            <el-checkbox-group v-if="data.options.customToolbarVisible" v-model="data.options.customToolbar" @change="saveToolbar">
              <div class="ql-toolbar ql-snow" style="border: none">
                <el-checkbox label="0" disabled>
                  <!-- ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线 -->
                  <span class="ql-formats">
                    <button type="button" class="ql-bold"><svg viewBox="0 0 18 18"> <path class="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"/> <path class="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"/> </svg></button>
                    <button type="button" class="ql-italic"><svg viewBox="0 0 18 18"> <line class="ql-stroke" x1="7" x2="13" y1="4" y2="4"/> <line class="ql-stroke" x1="5" x2="11" y1="14" y2="14"/> <line class="ql-stroke" x1="8" x2="10" y1="14" y2="4"/> </svg></button>
                    <button type="button" class="ql-underline"><svg viewBox="0 0 18 18"> <path class="ql-stroke" d="M5,3V9a4.012,4.012,0,0,0,4,4H9a4.012,4.012,0,0,0,4-4V3"/> <rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="12" x="3" y="15"/> </svg></button>
                    <button type="button" class="ql-strike"><svg viewBox="0 0 18 18"> <line class="ql-stroke ql-thin" x1="15.5" x2="2.5" y1="8.5" y2="9.5"/> <path class="ql-fill" d="M9.007,8C6.542,7.791,6,7.519,6,6.5,6,5.792,7.283,5,9,5c1.571,0,2.765.679,2.969,1.309a1,1,0,0,0,1.9-.617C13.356,4.106,11.354,3,9,3,6.2,3,4,4.538,4,6.5a3.2,3.2,0,0,0,.5,1.843Z"/> <path class="ql-fill" d="M8.984,10C11.457,10.208,12,10.479,12,11.5c0,0.708-1.283,1.5-3,1.5-1.571,0-2.765-.679-2.969-1.309a1,1,0,1,0-1.9.617C4.644,13.894,6.646,15,9,15c2.8,0,5-1.538,5-3.5a3.2,3.2,0,0,0-.5-1.843Z"/> </svg></button>
                  </span>
                </el-checkbox>
                <el-checkbox label="1">
                  <!-- ['blockquote', 'code-block'],     //引用，代码块 -->
                  <span class="ql-formats">
                    <button type="button" class="ql-blockquote"><svg viewBox="0 0 18 18"> <rect class="ql-fill ql-stroke" height="3" width="3" x="4" y="5"/> <rect class="ql-fill ql-stroke" height="3" width="3" x="11" y="5"/> <path class="ql-even ql-fill ql-stroke" d="M7,8c0,4.031-3,5-3,5"/> <path class="ql-even ql-fill ql-stroke" d="M14,8c0,4.031-3,5-3,5"/> </svg></button>
                    <button type="button" class="ql-code-block"><svg viewBox="0 0 18 18"> <polyline class="ql-even ql-stroke" points="5 7 3 9 5 11"/> <polyline class="ql-even ql-stroke" points="13 7 15 9 13 11"/> <line class="ql-stroke" x1="10" x2="8" y1="5" y2="13"/> </svg></button>
                  </span>
                </el-checkbox>
                <el-checkbox label="2">
                  <!-- [{ 'header': 1 }, { 'header': 2 },{ 'header': [1, 2, 3, 4, 5, 6, false] }],        // 标题，键值对的形式；1、2表示字体大小 -->
                  <span class="ql-formats">
                    <button type="button" class="ql-header" value="1"><svg viewBox="0 0 18 18"> <path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z"/> </svg></button>
                    <button type="button" class="ql-header" value="2"><svg viewBox="0 0 18 18"> <path class="ql-fill" d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/> </svg></button>
                  </span>
                </el-checkbox>
                <el-checkbox label="3">
                  <!--  [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表  -->
                  <span class="ql-formats">
                    <button type="button" class="ql-list" value="ordered"><svg viewBox="0 0 18 18"> <line class="ql-stroke" x1="7" x2="15" y1="4" y2="4"/> <line class="ql-stroke" x1="7" x2="15" y1="9" y2="9"/> <line class="ql-stroke" x1="7" x2="15" y1="14" y2="14"/> <line class="ql-stroke ql-thin" x1="2.5" x2="4.5" y1="5.5" y2="5.5"/> <path class="ql-fill" d="M3.5,6A0.5,0.5,0,0,1,3,5.5V3.085l-0.276.138A0.5,0.5,0,0,1,2.053,3c-0.124-.247-0.023-0.324.224-0.447l1-.5A0.5,0.5,0,0,1,4,2.5v3A0.5,0.5,0,0,1,3.5,6Z"/> <path class="ql-stroke ql-thin" d="M4.5,10.5h-2c0-.234,1.85-1.076,1.85-2.234A0.959,0.959,0,0,0,2.5,8.156"/> <path class="ql-stroke ql-thin" d="M2.5,14.846a0.959,0.959,0,0,0,1.85-.109A0.7,0.7,0,0,0,3.75,14a0.688,0.688,0,0,0,.6-0.736,0.959,0.959,0,0,0-1.85-.109"/> </svg></button>
                    <button type="button" class="ql-list" value="bullet"><svg viewBox="0 0 18 18"> <line class="ql-stroke" x1="6" x2="15" y1="4" y2="4"/> <line class="ql-stroke" x1="6" x2="15" y1="9" y2="9"/> <line class="ql-stroke" x1="6" x2="15" y1="14" y2="14"/> <line class="ql-stroke" x1="3" x2="3" y1="4" y2="4"/> <line class="ql-stroke" x1="3" x2="3" y1="9" y2="9"/> <line class="ql-stroke" x1="3" x2="3" y1="14" y2="14"/> </svg></button>
                  </span>
                </el-checkbox>
                <el-checkbox label="4">
                  <!-- [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标 -->
                  <span class="ql-formats">
                    <button type="button" class="ql-script" value="sub"><svg viewBox="0 0 18 18"> <path class="ql-fill" d="M15.5,15H13.861a3.858,3.858,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.921,1.921,0,0,0,12.021,11.7a0.50013,0.50013,0,1,0,.957.291h0a0.914,0.914,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.076-1.16971,1.86982-1.93971,2.43082A1.45639,1.45639,0,0,0,12,15.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,15Z"/> <path class="ql-fill" d="M9.65,5.241a1,1,0,0,0-1.409.108L6,7.964,3.759,5.349A1,1,0,0,0,2.192,6.59178Q2.21541,6.6213,2.241,6.649L4.684,9.5,2.241,12.35A1,1,0,0,0,3.71,13.70722q0.02557-.02768.049-0.05722L6,11.036,8.241,13.65a1,1,0,1,0,1.567-1.24277Q9.78459,12.3777,9.759,12.35L7.316,9.5,9.759,6.651A1,1,0,0,0,9.65,5.241Z"/> </svg></button>
                    <button type="button" class="ql-script" value="super"><svg viewBox="0 0 18 18"> <path class="ql-fill" d="M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z"/> <path class="ql-fill" d="M9.651,5.241a1,1,0,0,0-1.41.108L6,7.964,3.759,5.349a1,1,0,1,0-1.519,1.3L4.683,9.5,2.241,12.35a1,1,0,1,0,1.519,1.3L6,11.036,8.241,13.65a1,1,0,0,0,1.519-1.3L7.317,9.5,9.759,6.651A1,1,0,0,0,9.651,5.241Z"/> </svg></button>
                  </span>
                </el-checkbox>
                <el-checkbox label="5">
                  <!-- [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进 -->
                  <span class="ql-formats">
                    <button type="button" class="ql-indent" value="-1"><svg viewBox="0 0 18 18"> <line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/> <line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/> <line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/> <polyline class="ql-stroke" points="5 7 5 11 3 9 5 7"/> </svg></button>
                    <button type="button" class="ql-indent" value="+1"><svg viewBox="0 0 18 18"> <line class="ql-stroke" x1="3" x2="15" y1="14" y2="14"/> <line class="ql-stroke" x1="3" x2="15" y1="4" y2="4"/> <line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"/> <polyline class="ql-fill ql-stroke" points="3 7 3 11 5 9 3 7"/> </svg></button>
                  </span>
                </el-checkbox>
                <el-checkbox label="6">
                  <!-- [{ 'direction': 'rtl' }],// 文本方向 -->
                  <span class="ql-formats">
                    <button type="button" class="ql-direction" value="rtl"><svg viewBox="0 0 18 18"> <polygon class="ql-stroke ql-fill" points="3 11 5 9 3 7 3 11"/> <line class="ql-stroke ql-fill" x1="15" x2="11" y1="4" y2="4"/> <path class="ql-fill" d="M11,3a3,3,0,0,0,0,6h1V3H11Z"/> <rect class="ql-fill" height="11" width="1" x="11" y="4"/> <rect class="ql-fill" height="11" width="1" x="13" y="4"/> </svg><svg viewBox="0 0 18 18"> <polygon class="ql-stroke ql-fill" points="15 12 13 10 15 8 15 12"/> <line class="ql-stroke ql-fill" x1="9" x2="5" y1="4" y2="4"/> <path class="ql-fill" d="M5,3A3,3,0,0,0,5,9H6V3H5Z"/> <rect class="ql-fill" height="11" width="1" x="5" y="4"/> <rect class="ql-fill" height="11" width="1" x="7" y="4"/> </svg></button>
                  </span>
                </el-checkbox>
                <!-- [{ 'color': [] }, { 'background': [] },{ 'size': ['small', false, 'large', 'huge'] },{ 'font': [] }],     // 字体颜色，字体背景颜色, 字体大小,几级标题 -->
                <el-checkbox label="7">
                  <span class="ql-formats">
                    <span class="ql-color ql-picker ql-color-picker">
                      <span class="ql-picker-label" tabindex="0" role="button" aria-expanded="false" aria-controls="ql-picker-options-8"><svg viewBox="0 0 18 18"> <line class="ql-color-label ql-stroke ql-transparent" x1="3" x2="15" y1="15" y2="15"/> <polyline class="ql-stroke" points="5.5 11 9 3 12.5 11"/> <line class="ql-stroke" x1="11.63" x2="6.38" y1="9" y2="9"/> </svg></span>
                    </span>
                    <span class="ql-background ql-picker ql-color-picker"><span class="ql-picker-label" tabindex="0" role="button" aria-expanded="false" aria-controls="ql-picker-options-15"><svg viewBox="0 0 18 18"> <g class="ql-fill ql-color-label"> <polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"/> <rect height="1" width="1" x="4" y="4"/> <polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"/> <rect height="1" width="1" x="2" y="6"/> <rect height="1" width="1" x="3" y="5"/> <rect height="1" width="1" x="4" y="7"/> <polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"/> <rect height="1" width="1" x="2" y="12"/> <rect height="1" width="1" x="2" y="9"/> <rect height="1" width="1" x="2" y="15"/> <polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"/> <rect height="1" width="1" x="3" y="8"/> <path d="M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z"/> <path d="M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z"/> <path d="M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z"/> <rect height="1" width="1" x="12" y="2"/> <rect height="1" width="1" x="11" y="3"/> <path d="M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z"/> <rect height="1" width="1" x="2" y="3"/> <rect height="1" width="1" x="6" y="2"/> <rect height="1" width="1" x="3" y="2"/> <rect height="1" width="1" x="5" y="3"/> <rect height="1" width="1" x="9" y="2"/> <rect height="1" width="1" x="15" y="14"/> <polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"/> <rect height="1" width="1" x="13" y="7"/> <rect height="1" width="1" x="15" y="5"/> <rect height="1" width="1" x="14" y="6"/> <rect height="1" width="1" x="15" y="8"/> <rect height="1" width="1" x="14" y="9"/> <path d="M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z"/> <rect height="1" width="1" x="14" y="3"/> <polygon points="12 6.868 12 6 11.62 6 12 6.868"/> <rect height="1" width="1" x="15" y="2"/> <rect height="1" width="1" x="12" y="5"/> <rect height="1" width="1" x="13" y="4"/> <polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"/> <rect height="1" width="1" x="9" y="14"/> <rect height="1" width="1" x="8" y="15"/> <path d="M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z"/> <rect height="1" width="1" x="5" y="15"/> <path d="M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z"/> <rect height="1" width="1" x="11" y="15"/> <path d="M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z"/> <rect height="1" width="1" x="14" y="15"/> <rect height="1" width="1" x="15" y="11"/> </g> <polyline class="ql-stroke" points="5.5 13 9 5 12.5 13"/> <line class="ql-stroke" x1="11.63" x2="6.38" y1="11" y2="11"/> </svg></span><span id="ql-picker-options-15" class="ql-picker-options" aria-hidden="true" tabindex="-1"><span tabindex="0" role="button" class="ql-picker-item ql-primary" data-value="#000000" style="background-color: rgb(0, 0, 0);"/><span tabindex="0" role="button" class="ql-picker-item ql-primary" data-value="#e60000" style="background-color: rgb(230, 0, 0);"/><span tabindex="0" role="button" class="ql-picker-item ql-primary" data-value="#ff9900" style="background-color: rgb(255, 153, 0);"/><span tabindex="0" role="button" class="ql-picker-item ql-primary" data-value="#ffff00" style="background-color: rgb(255, 255, 0);"/><span tabindex="0" role="button" class="ql-picker-item ql-primary" data-value="#008a00" style="background-color: rgb(0, 138, 0);"/><span tabindex="0" role="button" class="ql-picker-item ql-primary" data-value="#0066cc" style="background-color: rgb(0, 102, 204);"/><span tabindex="0" role="button" class="ql-picker-item ql-primary" data-value="#9933ff" style="background-color: rgb(153, 51, 255);"/><span tabindex="0" role="button" class="ql-picker-item ql-selected"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#facccc" style="background-color: rgb(250, 204, 204);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#ffebcc" style="background-color: rgb(255, 235, 204);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#ffffcc" style="background-color: rgb(255, 255, 204);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#cce8cc" style="background-color: rgb(204, 232, 204);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#cce0f5" style="background-color: rgb(204, 224, 245);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#ebd6ff" style="background-color: rgb(235, 214, 255);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#bbbbbb" style="background-color: rgb(187, 187, 187);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#f06666" style="background-color: rgb(240, 102, 102);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#ffc266" style="background-color: rgb(255, 194, 102);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#ffff66" style="background-color: rgb(255, 255, 102);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#66b966" style="background-color: rgb(102, 185, 102);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#66a3e0" style="background-color: rgb(102, 163, 224);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#c285ff" style="background-color: rgb(194, 133, 255);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#888888" style="background-color: rgb(136, 136, 136);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#a10000" style="background-color: rgb(161, 0, 0);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#b26b00" style="background-color: rgb(178, 107, 0);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#b2b200" style="background-color: rgb(178, 178, 0);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#006100" style="background-color: rgb(0, 97, 0);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#0047b2" style="background-color: rgb(0, 71, 178);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#6b24b2" style="background-color: rgb(107, 36, 178);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#444444" style="background-color: rgb(68, 68, 68);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#5c0000" style="background-color: rgb(92, 0, 0);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#663d00" style="background-color: rgb(102, 61, 0);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#666600" style="background-color: rgb(102, 102, 0);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#003700" style="background-color: rgb(0, 55, 0);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#002966" style="background-color: rgb(0, 41, 102);"/><span tabindex="0" role="button" class="ql-picker-item" data-value="#3d1466" style="background-color: rgb(61, 20, 102);"/></span></span>
                  </span>
                </el-checkbox>
                <el-checkbox label="8">
                  <!-- [{ 'align': [] }],    //对齐方式 -->
                  <span class="ql-formats">
                    <span class="ql-align ql-picker ql-icon-picker">
                    <span class="ql-picker-label" tabindex="0" role="button" aria-expanded="false" aria-controls="ql-picker-options-11"><svg viewBox="0 0 18 18"> <line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"/> <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"/> <line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"/> </svg></span></span>
                  </span>
                </el-checkbox>
                <el-checkbox label="9">
                  <!--  ['image','video']    //上传图片、上传视频 -->
                  <span class="ql-formats">
                    <button type="button" class="ql-image"><svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"/> <circle class="ql-fill" cx="6" cy="7" r="1"/> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"/> </svg></button>
                    <button type="button" class="ql-video"><svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="12" width="12" x="3" y="3"/> <rect class="ql-fill" height="12" width="1" x="5" y="3"/> <rect class="ql-fill" height="12" width="1" x="12" y="3"/> <rect class="ql-fill" height="2" width="8" x="5" y="8"/> <rect class="ql-fill" height="1" width="3" x="3" y="5"/> <rect class="ql-fill" height="1" width="3" x="3" y="7"/> <rect class="ql-fill" height="1" width="3" x="3" y="10"/> <rect class="ql-fill" height="1" width="3" x="3" y="12"/> <rect class="ql-fill" height="1" width="3" x="12" y="5"/> <rect class="ql-fill" height="1" width="3" x="12" y="7"/> <rect class="ql-fill" height="1" width="3" x="12" y="10"/> <rect class="ql-fill" height="1" width="3" x="12" y="12"/> </svg></button>
                  </span>
                </el-checkbox>
                <el-checkbox label="10">
                  <!-- ['clean'],    //清除字体样式 -->
                  <span class="ql-formats">
                    <button type="button" class="ql-clean"><svg class="" viewBox="0 0 18 18"> <line class="ql-stroke" x1="5" x2="13" y1="3" y2="3"/> <line class="ql-stroke" x1="6" x2="9.35" y1="12" y2="3"/> <line class="ql-stroke" x1="11" x2="15" y1="11" y2="15"/> <line class="ql-stroke" x1="15" x2="11" y1="11" y2="15"/> <rect class="ql-fill" height="1" rx="0.5" ry="0.5" width="7" x="2" y="14"/> </svg></button>
                  </span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <!-- 单选 复选 选项 -->
        <el-form-item v-if="showFlag('options')" style="position: relative;">
          <!--<el-button type="text" class="preset" @click="handlePreset">导入预置项</el-button>-->
          <template v-if="data.type == 'radio'">
            <h3 class="navTitle">选项</h3>
            <el-radio-group v-model="data.options.defaultValue">
              <draggable
                :list="data.options.options"
                v-bind="{ group: { name:'options'}, ghostClass: 'ghost', handle: '.drag-item'}"
                tag="ul"
                handle=".drag-item"
                @update="saveFormData"
              >
                <li v-for="(item, index) in data.options.options" :key="item.id" style="position: relative;width: 120%">
                  <el-radio :label="item.value" style="margin-right: 5px;" @change="saveFormData">
                    <el-input :value="item.value" style="width:180px" size="mini" @focus="oldValue=item.value" @input="setNewLabel($event, item)" @blur="checkRepeat(index)">
                      <i slot="suffix">
                        <el-dropdown class="option-dropdown" trigger="click" @command="colorSelect">
                          <div :style="{'background-color': item.color}" class="circle-icon"/>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(cItem, cIndex) in colorArr" :key="cIndex" :command="index+ ',' +cIndex"><i :style="{'background-color': cItem.color}" class="circle"/>{{ cItem.text }}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </i>
                    </el-input>
                    <!--<el-input v-if="data.options.showLabel" v-model="item.label" style="width:90px;" size="mini" @blur="checkRepeat(index)">-->
                    <!--</el-input>-->
                  </el-radio>
                  <i class="drag-item" style="cursor: move;"><i class="icon iconfont iconmove" style="font-size: 22px;"/></i>
                  <el-button size="mini" icon="el-icon-close" class="ml10" style="border: 0;" @click="handleOptionsRemove(index)"/>
                </li>
              </draggable>
            </el-radio-group>
          </template>
          <template v-else>
            <h3 class="navTitle">选项</h3>
            <el-checkbox-group v-model="data.options.defaultValue" @change="checkBoxDefaultValueChange">
              <draggable
                :list="data.options.options"
                v-bind="{ group:{ name:'options' }, ghostClass: 'ghost', handle: '.drag-item'}"
                tag="ul"
                handle=".drag-item"
                @update="saveFormData"
              >
                <li v-for="(item, index) in data.options.options" :key="item.id" style="position: relative;width: 120%">
                  <el-checkbox :label="item.value" style="margin-right: 5px;" @change="saveFormData">
                    <el-input :style="{'width': '180px' }" :value="item.value" size="mini" @focus="oldValue=item.value" @input="setNewLabel($event, item)" @blur="checkRepeat(index)">
                      <i slot="suffix">
                        <el-dropdown class="option-dropdown" trigger="click" @command="colorSelect">
                          <div :style="{'background-color': item.color}" class="circle-icon"/>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(cItem, cIndex) in colorArr" :key="cIndex" :command="index+ ',' +cIndex"><i :style="{'background-color': cItem.color}" class="circle"/>{{ cItem.text }}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </i>
                    </el-input>
                    <!--<el-input v-if="data.options.showLabel" v-model="item.label" style="width:90px;" size="mini" @blur="checkRepeat(index)"/>-->
                  </el-checkbox>
                  <i class="drag-item" style="cursor: move;"><i class="icon iconfont iconmove" style="font-size: 22px;"/></i>
                  <el-button size="mini" icon="el-icon-close" class="ml10" style="border: 0;" @click="handleOptionsRemove(index)"/>
                </li>
              </draggable>
            </el-checkbox-group>
          </template>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddOption"> + {{ $t('fm.actions.addOption') }}</el-button>
          </div>
        </el-form-item>

        <!-- 成员类型 -->
        <div v-if="showFlag('memberRange')">
          <h3 class="navTitle">选项</h3>
          <el-form-item v-if="showFlag('multiple')&& data.type !== 'imgupload'" label="类型">
            <el-select v-model="data.options.multiple" clearable @change="handlMemberTypeChange">
              <el-option :value="0" label="单选"/>
              <el-option :value="1" label="多选"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="showFlag('memberRange')" label="选择范围" class="mt10">
            <div class="memberRange" @click="openMenberRange">
              <span>{{ memberRangeDesc }}</span>
              <i class="el-icon-arrow-right" style="line-height: unset;color:#0097FF"/>
            </div>
          </el-form-item>
        </div>
        <!--默认值-->
        <div v-if="showFlag('defaultValue') && !showFlag('options') && data.type !== 'html' && data.type!=='fileupload' && data.type!=='imgupload'">
          <h3 class="navTitle">{{ $t('fm.config.widget.defaultValue') }}</h3>
          <el-form-item v-if="data.type !== 'grid'">
            <!-- textarea -->
            <div v-if="data.type=='textarea'">
              <el-input :disabled="initValueDisabled" :rows="1" v-model="data.options.defaultValue" class="textareaInput" type="textarea" @blur="saveFormData" />
              <i slot="suffix" title="打开表达式编辑器" class="icon iconfont iconfunctions textareaIcon" @click="showExpressionDialog"/>
            </div>
            <template v-if="data.type=='input' || data.type == 'text'">
              <!-- 数字 -->
              <template v-if="data.options.dataType == 'number' || data.options.dataType == 'integer' || data.options.dataType == 'float'">
                <el-input :type="data.options.dataType" :disabled="initValueDisabled" v-model.number="data.options.defaultValue" @blur="saveFormData"/>
              </template>
              <!-- 默认值 -->
              <template v-else>
                <div style="display: flex;justify-content: space-between">
                  <el-input v-model="data.options.defaultValue" :disabled="initValueDisabled" placeholder="初始值" @blur="saveFormData"/>
                  <i title="打开表达式编辑器" class="icon iconfont iconfunctions" @click="showExpressionDialog"/>
                </div>
              </template>
            </template>
            <!-- 成员 -->
            <member v-if="data.type==='member'" :multiple="data.options.multiple" :member-range="data.options.memberRange" v-model="data.options.defaultValue" :key="memberKey" style="width: 100%" @change="saveFormData"/>

            <!-- 地理位置 -->
            <province-city-county v-if="data.type==='cascader'" :type="data.options.type" :value.sync="data.options.defaultValue" :is-default="true" @saveFormData="saveFormData"/>

            <!-- 开关 -->
            <el-select v-if="data.type=='switch'" v-model="data.options.defaultValue" placeholder="请选择" @change="saveFormData">
              <el-option :value="1" label="开"/>
              <el-option :value="0" label="关"/>
            </el-select>

            <!-- 数字 -->
            <div v-if="data.type=='number'" style="display: flex;justify-content: space-between">
              <el-input-number v-model="data.options.defaultValue" :disabled="data.options.expressionData !== undefined" :controls="false" :min="numMin" :max="numMax" @change="saveFormData" />
              <i title="打开表达式编辑器" class="icon iconfont iconfunctions" @click="showExpressionDialog" />
            </div>

            <!-- 日期 -->
            <div v-if="data.type == 'date'" style="width:100%;display: flex;justify-content: space-between">
              <el-date-picker
                v-if="data.options.type==='date'"
                v-model="data.options.defaultValue"
                :format="data.options.format"
                :disabled="initValueDisabled"
                type="date"
                placeholder="选择日期"
                @change="saveFormData"
              />
              <el-date-picker
                v-else-if="data.options.type==='datetime'"
                v-model="data.options.defaultValue"
                :format="data.options.format"
                :disabled="initValueDisabled"
                type="datetime"
                placeholder="选择日期时间"
                @change="saveFormData"
              />
              <i title="打开表达式编辑器" class="icon iconfont iconfunctions" @click="showExpressionDialog" />
            </div>
          </el-form-item>

          <!-- 单位 -->
          <el-form-item v-if="data.type=='number'" :label="$t('fm.config.widget.cell')" class="pb10" >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-select v-model="data.options.classify" @change="data.options.unit=''">
                  <el-option value="自定义"/>
                  <el-option value="金额"/>
                  <el-option value="百分比"/>
                </el-select>
              </el-col>
              <el-col :span="12">
                <template v-if="data.options.classify==='自定义'">
                  <el-input v-model.trim="data.options.unit" @blur="saveFormData"/>
                </template>
                <template v-else>
                  <el-select v-model="data.options.unit" @change="saveFormData">
                    <template v-if="data.options.classify==='金额'">
                      <el-option value="￥" label="￥(元)"/>
                      <el-option value="$" label="$(美元)"/>
                    </template>
                    <template v-if="data.options.classify==='百分比'">
                      <el-option value="%" label="%(百分号)"/>
                      <el-option value="‰" label="‰(千分号)"/>
                    </template>
                  </el-select>
                </template>
              </el-col>
            </el-row>
          </el-form-item>
        </div>

        <!-- type=html 内容编辑 -->
        <el-form-item v-if="data.type==='html'">
          <h3 class="navTitle">内容编辑</h3>
          <div style="display:flex; justify-content:space-between; background:ghostwhite; cursor:pointer;" @click="htmlEditorDialog">
            <el-button type="text">点击开始编辑</el-button>
            <i class="el-icon-arrow-right" style="margin-top:8px;"/>
          </div>
        </el-form-item>

        <!-- 校验 -->
        <template v-if="showFlag('required')">
          <h3 class="navTitle">{{ $t('fm.config.widget.validate') }}</h3>
          <el-form-item>
            <!-- 必填 -->
            <el-checkbox v-model="data.options.required" @change="dealRequired">{{ $t('fm.config.widget.required') }}</el-checkbox>
            <!-- 重复校验 -->
            <!--<el-checkbox v-if="Object.keys(data.options).indexOf('repeatCheck')>=0" v-model="data.options.repeatCheck">{{$t('fm.config.widget.repeatCheck')}}</el-checkbox>-->
            <el-checkbox v-if="data.type === 'input' || data.type==='member' || data.type === 'relatedChoice'" v-model="data.isDuplicated" @change="saveFormData">重复校验</el-checkbox>
            <el-checkbox v-if="data.type==='member'" v-model="data.options.isFilterMember" @change="saveFormData">过滤无应用权限用户</el-checkbox>
            <!-- 整数校验 -->
            <el-checkbox v-if="data.type === 'number'" v-model="data.options.integer" style="display: block;" @change="saveFormData">整数校验</el-checkbox>
            <!-- 数值范围 -->
            <el-checkbox v-if="data.type === 'number'" v-model="data.options.numericalRange" @change="dealNumericalRange">数值范围</el-checkbox>
            <div v-if="data.options.numericalRange">
              <!--最小值-->
              <el-input-number v-model="data.options.min" :controls="false" placeholder="最小值" class="inline" style="width: 100px" @blur="saveMinNumber"/> —
              <!--最大值-->
              <el-input-number v-model="data.options.max" :min="data.options.min" :controls="false" placeholder="最大值" class="inline" style="width: 100px" @blur="saveMaxNumber"/>
            </div>
          </el-form-item>
        </template>

        <!-- 校验类型 -->
        <template>
          <el-form-item v-if="showFlag('validateType') && data.type !== 'textarea' && data.type !== 'editor'" :label="$t('fm.config.widget.validateType')">
            <el-select v-model="data.options.validateType" @change="saveFormData">
              <el-option label="一般" value="maxlength"/>
              <el-option label="姓名" value="name"/>
              <el-option label="邮箱" value="email"/>
              <el-option label="电话" value="phone"/>
            </el-select>
          </el-form-item>
          <div v-if="showFlag('maxlength') && data.options.validateType ==='maxlength'">
            <h4 class="subTitlePro">字数限制</h4>
            <el-input-number v-model="data.options.maxlength" :precision="0" :controls="false" @blur="maxlengthChange"/>
          </div>
        </template>

        <!-- 样式 -->
        <div v-if="data.type !== 'grid' && data.type !=='switch' && data.type !=='autonumber' && data.type !=='imgupload' && data.type !=='html' && data.type !=='relatedForm' && data.type !== 'paging'">
          <h3 class="navTitle">{{ data.type === 'number'?'显示样式':'样式' }}</h3>
          <div>
            <el-form-item v-if="showFlag('thousandBit')" class="mt10">
              <el-checkbox v-model="data.options.thousandBit" @change="saveFormData">千位符</el-checkbox>
            </el-form-item>
            <el-form-item v-if="!data.options.integer && showFlag('float')" label="小数点后位数" class="mt10">
              <el-input-number v-model="data.options.float" :precision="0" :controls="false" @blur="saveFormData"/>
            </el-form-item>
            <el-form-item v-if="showFlag('controls')" class="mt10">
              <el-checkbox v-model="data.options.controls" @change="saveFormData">加减步进</el-checkbox>
            </el-form-item>
            <el-form-item v-if="data.options.controls&&showFlag('step')" label="步进值" class="mt10">
              <el-input-number v-model="data.options.step" :precision="data.options.float || 0" :controls="false" placeholder="请输入" @blur="saveFormData"/>
            </el-form-item>
          </div>
          <div v-if="showFlag('format')">
            <el-form-item v-if="data.options.type==='date'" label="日期" class="mt10">
              <el-select v-model="data.options.format" @change="saveFormData">
                <el-option value="yyyy年MM月dd日"/>
                <el-option value="yyyy-MM-dd"/>
                <el-option value="yyyy/MM/dd"/>
              </el-select>
            </el-form-item>
            <el-form-item v-if="data.options.type==='datetime'" label="日期" class="mt10">
              <el-select v-model="data.options.format" @change="saveFormData">
                <!--<el-option value="yyyy年MM月dd日 HH点mm分ss秒"></el-option>-->
                <el-option value="yyyy-MM-dd HH:mm:ss"/>
                <el-option value="yyyy/MM/dd HH:mm:ss"/>
                <!--<el-option value="yyyy年MM月dd日 HH点mm分"></el-option>-->
                <el-option value="yyyy-MM-dd HH:mm"/>
                <el-option value="yyyy/MM/dd HH:mm"/>
              </el-select>
            </el-form-item>
          </div>
          <!-- 样式 - 平铺,下拉 -->
          <el-form-item v-if="showFlag('isSelect')" class="mt10">
            <el-select v-model="data.options.isSelect" @change="saveFormData(0)">
              <el-option :value="0" label="平铺"/>
              <el-option :value="1" label="下拉"/>
            </el-select>
          </el-form-item>
          <!-- 样式 - 宽中窄 -->
          <el-form-item v-if="showFlag('width')" :label="optionWidth" class="mt10">
            <el-select v-model="data.options.width" @change="saveFormData">
              <el-option value="120px" label="窄"/>
              <el-option value="240px" label="中"/>
              <el-option value="360px" label="宽"/>
            </el-select>
          </el-form-item>
          <!-- 样式 - 行数 -->
          <el-form-item v-if="showFlag('rows')" class="mt10" label="行数">
            <el-select v-model="data.options.rows" @change="saveFormData(0)">
              <el-option :value="3" label="3行"/>
              <el-option :value="4" label="4行"/>
              <el-option :value="5" label="5行"/>
              <el-option :value="6" label="6行"/>
              <el-option :value="7" label="7行"/>
              <el-option :value="8" label="8行"/>
              <el-option :value="9" label="9行"/>
              <el-option :value="10" label="10行"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="showFlag('isHoverDetail')">
            <el-checkbox v-model="data.options.isHoverDetail" @change="saveFormData">鼠标悬停显示详情</el-checkbox>
          </el-form-item>
        </div>

        <!-- 权限 -->
        <div v-if="data.type!='blank' && data.type !== 'grid' && data.type !== 'html'">
          <h3 class="navTitle">权限</h3>
          <el-form-item>
            <el-select :value="roles" filterable multiple placeholder="搜索" @change="setRole">
              <el-option
                v-for="item in allAuthorizationList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </div>

        <!-- 说明 -->
        <div v-if="data.type!='blank' && data.type !== 'grid' && data.type !== 'html' && data.type !== 'paging'">
          <h3 class="navTitle">说明</h3>

          <!-- 引导文字 -->
          <el-form-item v-if="showFlag('placeholder')" label="引导文字" class="pb10">
            <el-input v-model="data.options.placeholder" placeholder="填写文本内容" @blur="saveFormData"/>
          </el-form-item>
          <!-- 帮助提示 -->
          <el-form-item v-if="showFlag('help')" label="帮助提示">
            <el-input :rows="5" v-model="data.options.help" type="textarea" placeholder="填写帮助提示" @blur="saveFormData">></el-input>
          </el-form-item>
        </div>

        <!--数据配置-->
        <div v-if="showFlag('linkForm')">
          <div class="el-form-item__label subTitle">数据配置</div>
          <el-form-item>
            <el-select v-model="data.options.linkForm" filterable clearable placeholder="关联表单" @change="saveFormData">
              <el-option
                v-for="item in linkFormList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="showFlag('selectForm')">
            <el-select v-model="data.options.selectForm" filterable clearable placeholder="选择表单" @change="saveFormData">
              <el-option
                v-for="item in selectFormList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <!-- todo 列表 *** -->
      <div v-else-if="muneType=='listPage'">
        <list-property v-if="muneType=='listPage'" :data.sync="data" :cur-page-id="curPageId" @saveFormData="saveFormData"/>
      </div>
    </el-form>
    <!-- HTML编辑器 -->
    <el-dialog
      :visible.sync="htmlEditorDialogVisible"
      :close-on-click-modal="false"
      :before-close="htmlEditorDialogClose"
      title="HTML编辑器"
      width="60%">
      <el-quill-editor
        ref="myQuillEditor"
        v-model="data.options.defaultValue"
        @blur="onEditorBlur($event)"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="htmlEditorDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="htmlEditorDialogClose">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗 - 关联组件 - 选择显示字段 -->
    <el-dialog
      v-if="relatedChoiceFieldDialog"
      :visible.sync="relatedChoiceFieldDialog"
      :close-on-click-modal="false"
      title="选择显示字段"
      width="30%">
      <el-row>
        <el-col :span="4"><div class="el-form-item__label" style="margin-top: 5px">选择字段</div></el-col>
        <el-col :span="20">
          <el-select v-model="relatedChoiceFieldDialogOptions" multiple placeholder="请选择关联字段">
            <el-option
              v-for="item in relatedChoiceFieldOptions"
              v-show="!getRelatedChoiceDialogDisabled(item.fieldId) && (item.type !=='grid' && item.type !=='paging')"
              :key="item.fieldId"
              :label="item.name"
              :value="item.fieldId"
              :disabled="!item.choiceOptional"
            >
              <div class="flex-between">
                <span>{{ item.name }}</span>
                <span class="inline ml30" style="color: #8492a6; font-size: 12px">{{ showFieldType(item) }}</span>
              </div>
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="relatedFieldDialogConfirm">保存</el-button>
        <el-button @click="relatedFieldDialogCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!--关联表单 配置表头-->
    <el-dialog v-if="relatedFormHeaderDialog.visible" :visible.sync="relatedFormHeaderDialog.visible" title="表单排序">
      <set-table-header v-model="relatedFormHeader" :all-field="relatedFormHeaderDialog.fields" from="relatedForm"/>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="relatedFormHeaderConfirm">保存</el-button>
        <el-button @click="relatedFormHeaderCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 自编号组件设置 - shou -->
    <el-dialog :visible.sync="autoNumberDialog.autoNumberFlag" :show-close="false" :close-on-click-modal="false" top="30vh" title="自编号组件设置" width="30%">
      <span class="setColor ft12">设置后不可更改</span>
      <el-row class="mt15">
        <el-col :span="4" class="ft12">前缀</el-col>
        <el-col :span="20"><el-input v-model="autoNumberDialog.autoNumberPrefix" placeholder="文本"/></el-col>
      </el-row>
      <el-row class="mt10">
        <el-col :span="4" class="ft12">起始值</el-col>
        <el-col :span="20"><el-input-number v-model="autoNumberDialog.autoNumberValue" :controls="false" placeholder="数字"/></el-col>
      </el-row>
      <el-row class="mt20 mb10">
        <el-col align="right"><el-button type="primary" @click="saveAutoNumber">保存</el-button><el-button @click="deleteAutoNumber">取消</el-button></el-col>
      </el-row>
    </el-dialog>
    <!--成员组件设置 成员范围-->
    <el-dialog :visible.sync="memberDialog.visible" :show-close="false" :close-on-click-modal="false" top="30vh" title="成员组件设置" width="500px">
      <div style="display: flex">
        <div style="width: 100px;">选择范围</div>
        <el-select
          v-more="loadMore"
          v-model="memberDialog.memberRange"
          :remote-method="remoteMethod"
          multiple
          filterable
          remote
          placeholder="请选择">
          <el-option-group
            v-for="group in memberDialog.memberOptions"
            :key="group.label"
            :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="group.label+'-'+item.value"/>
          </el-option-group>
          <transition name="fade">
            <div v-show="memberDialog.loading" class="loading">
              <i class="el-icon-loading"/><span>加载中...</span>
            </div>
          </transition>
        </el-select>
      </div>
      <el-row class="mt20 mb10">
        <el-col align="right">
          <el-button type="primary" @click="saveMemberRange">保存</el-button>
        <el-button @click="cancelDialog">取消</el-button></el-col>
      </el-row>
    </el-dialog>
    <expression-dialog v-if="showExpression" :data="data" :expression-data.sync="expressionValue" :show-expression.sync = "showExpression" :template-data-id = "data.templateDataId" @save="saveExpression" @cancel="cancelExpression"/>
  </div>
  <!--请添加字段-->
  <div v-else class="empty">
    {{ $t('fm.description.configEmpty') }}
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import CodeEditor from '../CodeEditor'
import ListProperty from '../list/listproperty'
import ProvinceCityCounty from '../provinceCityCounty/index'
import Member from '../member/index'
import { getCompanyId, getAppId } from '@/util/auth'
import { showFieldTypeDesc } from '@/util/index'
import { getComparisonOpers } from '@/util/index'
import { toolbarOptions, handlers } from '@/components/form/Upload/quillEditor.js'
import { roleSimpleSearch, formPageGetFields, formFieldList } from '@/api/builder'
import ElQuillEditor from './ElQuillEditor'
import { userSearchList, searchDepartments } from '@/api/workflow'
import filterCondition from '@/components/filterCondition/index'
import { formFieldDelete } from '@/api/builder'
import _ from 'lodash'
import expressionDialog from '../expression/expressionDialog'
import setTableHeader from '@/components/SetTableHeader/'
export default {
  components: {
    Draggable,
    Member,
    CodeEditor,
    ListProperty,
    ProvinceCityCounty,
    ElQuillEditor,
    filterCondition,
    expressionDialog,
    setTableHeader
  },
  directives: {
    more: {
      // 指令的定义
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          const CONDITION = this.scrollHeight - Math.ceil(this.scrollTop) <= this.clientHeight
          if (CONDITION) {
            binding.value()
          }
        })
      }
    }
  },
  props: ['data', 'muneType', 'curPageId'],
  data() {
    return {
      autoNumberDialog: {
        autoNumberFlag: false, // 自编号输入框
        autoNumberPrefix: '', // 自编号前缀
        autoNumberValue: '' // 自编号起始值
      },
      memberKey: 0,
      memberDialog: {
        memberRange: [],
        visible: false,
        memberOptions: [
          {
            label: '部门',
            options: []
          },
          {
            label: '成员',
            options: []
          }
        ],
        loading: false,
        userTotal: 0,
        userSearch: {
          page: 1,
          size: 10,
          companyId: getCompanyId(),
          allData: true
        }
      },
      managerId: '',
      rules: {
        name: [
          {
            required: true,
            // pattern: /^([\u4e00-\u9fa5][\u4e00-\u9fa5\-_~]{1,9})$|^([a-zA-Z][a-zA-Z\-_~]{2,19})$/,
            message: '名称不能为空', trigger: ['change', 'blur']
          }
        ]
      },
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null
      },
      iconList: [
        { label: '电脑', value: 'iconmenu_computer' },
        { label: '日历', value: 'iconmenu_calendar' },
        { label: '运输', value: 'iconmenu_bus' },
        { label: '数据库', value: 'iconmenu_database' },
        { label: '文件', value: 'iconmenu_file' },
        { label: '文件夹', value: 'iconmenu_folder' },
        { label: '分组', value: 'iconmenu_group' },
        { label: '图片', value: 'iconmenu_image' },
        { label: '财务', value: 'iconmenu_money' },
        { label: '商场', value: 'iconmenu_store' },
        { label: '设置', value: 'iconmenu_settings' },
        { label: '邮件', value: 'iconmenu_mail' },
        { label: '菜单', value: 'iconmenu_menu' },
        { label: '主页', value: 'iconmenu_home' }
      ],
      allAuthorizationList: [],
      selectFormList: [], // 选择表单List
      linkFormList: [], // 关联表单List
      checkBoxDefaultValueId: [],
      memberChangeKey: 0,
      htmlEditorDialogVisible: false,
      editorOption: {
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: handlers
          }
        }
      },
      relatedChoiceFieldDialog: false,
      relatedChoiceFieldDialogOptions: [],
      relatedFormFilterDialog: {
        visible: false,
        formParentId: '',
        formPageId: '',
        formData: {
          workflowFilterDtoList: []
        }
      },
      relatedFormHeaderDialog: {
        visible: false,
        fields: []
      },
      colorArr: [{
        rgba: '',
        color: '',
        text: '无'
      }, {
        rgba: 'rgba(229,116,80,.2)',
        color: '#e57450',
        text: '红色'
      }, {
        rgba: 'rgba(126,191,80,.2)',
        color: '#7ebf50',
        text: '绿色'
      }, {
        rgba: 'rgba(144,147,152,.2)',
        color: '#909398',
        text: '灰色'
      }, {
        rgba: 'rgba(220,164,80,.2)',
        color: '#dca450',
        text: '黄色'
      }],
      oldValue: '', // 单选框 复选框 修改之前的值
      showExpression: false,
      currentTemplateDataId: '',
      relatedFormHeader: [],
      currentFieldsList: []
    }
  },
  computed: {
    initValueDisabled() {
      return this.data.options.expressionData && this.data.options.expressionData.expression !== ''
    },
    expressionValue() {
      return this.data.options.expressionData || {}
    },
    numMin() {
      return this.data.options.numericalRange ? this.data.options.min : -Infinity
    },
    numMax() {
      return this.data.options.numericalRange ? this.data.options.max : Infinity
    },
    roles() {
      return this.data.roles ? this.data.roles.split(',') : ['0']
    },
    relatedChoiceFormName() {
      const formId = this.$store.state.components.currentFormId
      const appAllForm = this.$store.state.components.form
      const arr = appAllForm.filter(item =>
        item.pageTemplateId === formId ||
        (item.child.map(c => c.pageTemplateId).indexOf(formId) > -1)
      )
      return arr.length > 0 ? arr[0].pageTemplateName : formId
    },
    relatedFormName() {
      const arr = this.$store.state.components.form.filter(item => item.pageTemplateId === this.$store.state.components.currentFormId)
      return arr.length > 0 ? arr[0].pageTemplateName : this.$store.state.components.currentFormId
    },
    relatedChoiceConditionNum() {
      let num = 0
      this.data.options.filter.forEach(item => { num += item.conditionDtoList.length })
      return '已设置 ' + num + ' 个条件'
    },
    relatedChoiceFieldOptions() {
      // return this.$store.state.components.currentFields.filter(item => item.choiceOptional)
      // console.log(this.$store.state.components.currentFields.filter(item => item.choiceOptional))
      return this.$store.state.components.currentFields
    },
    relatedChoicePreview() {
      const fieldArray = this.data.options.field.map(m => {
        const obj = this.$store.state.components.currentFields.find(f => f.fieldId === m)
        if (obj) {
          return obj.name
        }
      })
      if (fieldArray.length > 1) {
        return fieldArray[0] + '（' + fieldArray.slice(1).join(',') + '）'
      } else if (fieldArray.length === 1) {
        return fieldArray[0]
      } else {
        return ''
      }
    },
    // 是否显示该属性
    showFlag() {
      return function(type) {
        const arr = ['name', 'dataKey', 'isDuplicated']
        if (arr.includes(type)) {
          return true
        }
        return Object.keys(this.data.options).indexOf(type) >= 0
      }
    },
    show() {
      if (this.data && Object.keys(this.data).length > 0 && this.data.key) {
        return true
      }
      return false
    },
    optionWidth() {
      if (this.data.type === 'number') {
        return '样式'
      } else if (this.data.type === 'date' || this.data.type === 'radio' || this.data.type === 'cascader' || this.data.type === 'checkbox' || this.data.type === 'editor') {
        return '宽度'
      } else {
        return ''
      }
    },
    editor() {
      return this.$refs.myQuillEditor.quill
    },
    memberRangeDesc() {
      if (this.data.options.memberRange && (this.data.options.memberRange.departmentIds.length || this.data.options.memberRange.userIds.length)) {
        return this.data.options.memberRange.departmentIds.length + '部门，' + this.data.options.memberRange.userIds.length + '成员'
      } else {
        return '所有成员'
      }
    },
    relatedFormHeaderShow() {
      const dateKeyArr = new Set(this.data.options.header.map(item => item.dataKey))
      const requiredFieldIdArr = new Set(this.$store.state.components.currentFields.filter(item => item.required).map(item => item.fieldId))
      const requiredNoFieldIdArr = new Set(this.$store.state.components.currentFields.filter(item => !item.required).map(item => item.fieldId))
      const requriedNum = new Set([...dateKeyArr].filter(x => requiredFieldIdArr.has(x))).size
      const requriedNoNum = new Set([...dateKeyArr].filter(x => requiredNoFieldIdArr.has(x))).size
      if (requriedNum > 0 && requriedNoNum > 0) {
        return '已选：' + requriedNum + '个必填项，' + requriedNoNum + '个可选项'
      } else {
        if (requriedNum > 0) {
          return '已选：' + requriedNum + '个必填项'
        } else if (requriedNoNum > 0) {
          return '已选：' + requriedNoNum + '个可选项'
        } else {
          return '点击选择表头'
        }
      }
    }
  },
  inject: ['initMenu', 'saveFormData', 'getCurPageCompsData'],
  watch: {
    'data.dataKey': function(val) {
      if (this.data && this.data.type && this.data.type === 'autonumber' && this.data.options.autoNumberPrefix === '') {
        this.autoNumberDialog.autoNumberFlag = true
        this.autoNumberDialog.autoNumberPrefix = ''
        this.autoNumberDialog.autoNumberValue = ''
      }
    },
    'data.options.isRange': function(val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.options.defaultValue = null
        } else {
          if (Object.keys(this.data.options).indexOf('defaultValue') >= 0) { this.data.options.defaultValue = '' }
        }
      }
    },
    'data.options.validateType': function(val) {
      if (!this.data.options) {
        return
      }
      if (val === 'name') {
        this.data.options.pattern = '/^([\\u4e00-\\u9fa5]{1,20}|[a-zA-Z\\.\\s]{1,20})$/'
      } else if (val === 'phone') {
        this.data.options.pattern = '/^1[3-9](\\d{9})$/'
      } else if (val === 'email') {
        this.data.options.pattern = '/^([a-zA-Z]|[0-9])(\\w|\\-|\\.)+@[a-zA-Z0-9]+\\.([a-zA-Z]{2,4})$/'
      } else {
        this.data.options.pattern = ''
      }
    },
    'data.options.required': function(val) {
      this.validateRequired(val)
    },
    'data.options.dataType': function(val) {
      this.validateDataType(val)
    },
    'data.options.pattern': function(val) {
      this.valiatePattern(val)
    },
    'data.name': function(val) {
      if (this.data && this.data.options) {
        this.validateRequired(this.data.options.required)
        this.validateDataType(this.data.options.dataType)
        this.valiatePattern(this.data.options.pattern)
      }
    },
    relatedChoiceFieldOptions: {
      deep: true,
      handler(val) {
        if (val.length > 0 && this.data && this.data.type === 'relatedChoice') {
          const fieldIdArr = this.relatedChoiceFieldOptions.map(m => m.fieldId)
          this.data.options.field = this.data.options.field.filter(f => fieldIdArr.includes(f))
          this.saveFormData()
        }
      }
    }
  },
  async mounted() {
    this.init()
    if (this.data && this.data.type === 'autonumber') {
      this.autoNumberDialog.autoNumberFlag = true
      this.autoNumberDialog.autoNumberPrefix = ''
      this.autoNumberDialog.autoNumberValue = ''
    }
    if (this.data && this.data.type === 'member') {
      this.memberDialog.memberOptions = [
        { label: '部门', options: [] },
        { label: '成员', options: [] }
      ]
      this.getDepartments()
      await this.focusData()
    }
  },
  methods: {
    // 关联表单取消取消
    relatedFormHeaderCancel() {
      this.relatedFormHeaderDialog.visible = false
    },
    relatedFormHeaderConfirm() {
      if (!this.relatedFormHeader.length) {
        this.$message.error('至少保留一个字段')
        return
      }
      this.data.options.header = this.relatedFormHeader.map(m => {
        return {
          dataKey: m
        }
      })

      this.saveFormData()
      this.relatedFormHeaderDialog.visible = false
    },
    // 关联表单 - 添加字段
    addRelatedFormFieldContent() {
      if (this.data.options.header.length >= this.relatedFormHeaderDialog.fields.length) {
        this.$message.error('最多' + this.relatedFormHeaderDialog.fields.length + '项')
        return
      }
      this.data.options.header.push({
        dataKey: ''
      })
    },
    removeRelatedChoiceOption(fieldId) {
      if (this.data.options.field.length < 1) {
        this.$message.error('至少保留一个字段')
        return
      }
      this.data.options.field.splice(this.data.options.field.findIndex(item => item === fieldId), 1)
      this.saveFormData()
    },
    relatedFieldOptionChange(newFieldId, oldFieldId) {
      this.data.options.field.splice(this.data.options.field.indexOf(oldFieldId), 1, newFieldId)
      this.saveFormData()
    },
    fieldOptionDisabled(item) {
      // 关联选项组件：允许显示的字段类型：文本/数字/日期时间/单选项/成员(单选类)/自编号
      return !(item.type === 'input' ||
        item.type === 'number' ||
        item.type === 'date' ||
        item.type === 'radio' ||
        item.type === 'member' && item.options.multiple === 0 ||
        item.type === 'autonumber')
    },
    getRelatedChoiceDisabled(fieldId, nowFieldId) {
      if (fieldId === nowFieldId) {
        return false
      } else {
        const arr = this.$store.state.components.currentFields.filter(item => this.data.options.field.indexOf(item.fieldId) < 0).map(item => item.fieldId)
        if (arr.indexOf(fieldId) < 0) {
          return true
        } else {
          return false
        }
      }
    },
    getRelatedChoiceDialogDisabled(fieldId) {
      // console.log(this.data.options.field)
      return this.data.options.field ? this.data.options.field.indexOf(fieldId) > -1 : false
    },
    relatedFieldDialogConfirm() {
      this.relatedChoiceFieldDialogOptions.filter(item => this.data.options.field.indexOf(item) < 0).forEach(item => {
        this.data.options.field.push(item)
      })
      this.saveFormData()
      this.relatedChoiceFieldDialogOptions.splice(0, this.relatedChoiceFieldDialogOptions.length)
      this.relatedChoiceFieldDialog = false
    },
    relatedFieldDialogCancel() {
      this.relatedChoiceFieldDialog = false
      this.relatedChoiceFieldDialogOptions.splice(0, this.relatedChoiceFieldDialogOptions.length)
    },
    filterChange(val) {
      if (!val) {
        this.relatedFormFilterDialog.formData.workflowFilterDtoList = []
        this.data.options.filter = []
        this.saveFormData()
      }
    },
    async relatedFormFilterDialogOpen() {
      const data = JSON.parse(JSON.stringify(this.data.options.filter))
      this.relatedFormFilterDialog.formParentId = this.$store.state.components.currentFormId
      this.$store.state.components.form.filter(item => item.pageTemplateId === this.relatedFormFilterDialog.formParentId).forEach(
        item => {
          item.child.filter(child => child.pageType === 1).forEach(child => {
            this.relatedFormFilterDialog.formPageId = child.pageTemplateId
          })
        }
      )
      this.relatedFormFilterDialog.formData.workflowFilterDtoList = data
      await this.getCurrentInfo()
      this.relatedFormFilterDialog.visible = true
    //  :page-id="relatedFormFilterDialog.formParentId" :target-form-page-id="relatedFormFilterDialog.formPageId"
    },
    // 过滤器
    async getCurrentInfo() {
      const res = await formPageGetFields({ templateDataId: this.relatedFormFilterDialog.formParentId })
      const resp = await formFieldList(this.relatedFormFilterDialog.formPageId)
      const formList = resp.body
      let currentFieldsList = res.body
      if (!currentFieldsList.length) {
        this.$message.error('表单无字段可选')
        return
      }

      currentFieldsList = currentFieldsList.filter(f => f.type !== 'grid' && f.type !== 'relatedForm' && f.type !== 'html')
      currentFieldsList.forEach(item => {
        this.$set(item, 'isShowTip', true)
        item.comparisonOpersArr = item.comparisonOpers.split(',') // 下拉框条件
        item.comparisonOpersArr.forEach((m, i) => {
          item.comparisonOpersArr[i] = {
            label: getComparisonOpers(m),
            value: m
          }
        })
        formList.forEach(f => {
          if (item.dataKey === f.dataKey) {
            this.$set(item, 'options', f.options)
          }
        })
      })
      this.currentFieldsList = [
        {
          label: '',
          fieldsType: 'fields',
          options: currentFieldsList.filter(f => !f.sysAdd)
        },
        {
          label: '',
          fieldsType: 'sys',
          options: currentFieldsList.filter(f => f.sysAdd)
        }
      ]
    },
    relatedFormFilterDialogClose() {
      this.relatedFormFilterDialog.formData.workflowFilterDtoList = []
      this.relatedFormFilterDialog.visible = false
    },
    relatedFormFilterDialogConfirm() {
      this.$refs.relatedFormFilterData.validate((valid) => {
        if (valid) {
          this.data.options.filter = this.relatedFormFilterDialog.formData.workflowFilterDtoList
          this.saveFormData()
          this.relatedFormFilterDialog.visible = false
        } else {
          // this.relatedFormFilterDialog.formData.workflowFilterDtoList = []
        }
      })
    },
    relatedFormHeaderDialogOpen() {
      this.relatedFormHeaderDialog.fields = _.cloneDeep(this.$store.state.components.currentFields).filter(item => item.type === 'input' ||
        item.type === 'textarea' ||
        item.type === 'number' ||
        item.type === 'date' ||
        item.type === 'radio' ||
        item.type === 'checkbox' ||
        item.type === 'member' ||
        item.type === 'switch' ||
        item.type === 'autonumber' ||
        item.type === 'cascader' ||
        item.type === 'imgupload' ||
        item.type === 'fileupload' ||
        item.type === 'relatedChoice'
      )
      const fieldIdArr = this.relatedFormHeaderDialog.fields.map(m => m.fieldId)
      this.data.options.header = this.data.options.header.filter(f => fieldIdArr.includes(f.dataKey))
      this.relatedFormHeader = this.data.options.header.map(m => m.dataKey)
      this.relatedFormHeaderDialog.visible = true
      this.relatedFormHeaderDialog.fields.forEach(item => { item.dataKey = item.fieldId })
    },

    relatedFormHeaderDialogClose() {
      // this.relatedFormFilterDialog.formData.workflowFilterDtoList = []
      this.relatedFormHeaderDialog.visible = false
    },
    relatedFormHeaderDialogConfirm() {
      // this.data.options.filter = this.relatedFormFilterDialog.formData.workflowFilterDtoList
      // this.saveFormData()
      this.relatedFormHeaderDialog.visible = false
    },
    init() {
      // 获取权限列表
      const jsonData = {
        companyId: getCompanyId(),
        appId: getAppId(),
        current: 1,
        size: 100,
        onlyRole: true
      }
      roleSimpleSearch(jsonData).then(res => {
        this.allAuthorizationList = res.body
      })
    },
    dealNumericalRange(val) {
      if (val) {
        this.data.options.min = 0
        this.data.options.max = 0
        this.data.options.defaultValue = 0
      }
      this.saveFormData()
    },
    dealRequired() {
      setTimeout(() => {
        this.saveFormData()
      }, 300)
    },
    saveName(e) {
      if (e.target.value === '') {
        return
      }
      this.saveFormData()
    },
    saveToolbar() {
      if (this.data.options.customToolbar.length > 0) {
        this.data.options.customToolbar.sort()
      }
      // 对选项栏进行排序
      this.saveFormData()
    },
    // 修改最小值
    saveMinNumber() {
      if (this.data.options.max < this.data.options.min) {
        this.data.options.max = this.data.options.min
      }
      this.dealDefaultValue()
      this.saveFormData()
    },
    // 修改最大值
    saveMaxNumber() {
      this.dealDefaultValue()
      this.saveFormData()
    },
    dealDefaultValue() {
      if (this.data.options.defaultValue < this.data.options.min) {
        this.data.options.defaultValue = this.data.options.min
      }
      if (this.data.options.defaultValue > this.data.options.max) {
        this.data.options.defaultValue = this.data.options.max
      }
    },
    // 修改label
    setNewLabel(val, item) {
      const oldValue = item.value
      item.value = val
      item.label = val
      const index = this.data.options.defaultValue.indexOf(oldValue)
      if (this.data.options.defaultValue instanceof Array) {
        if (index !== -1) {
          this.data.options.defaultValue[index] = val
        }
      } else {
        if (this.data.options.defaultValue === oldValue) {
          this.data.options.defaultValue = val
        }
      }
    },
    // 检查重复项
    checkRepeat(index) {
      if (!this.data.options.options[index].value) {
        this.data.options.options[index].value = this.oldValue
        this.getCheckBoxDefaultValue()
        this.$message.error('不能为空')
        return
      }
      const options = this.data.options.options.map(m => m.value)
      const newOption = Array.from(new Set(options))
      if (options.length !== newOption.length) {
        this.$message.error('有重复项')
        this.data.options.options[index].value = this.oldValue
        this.getCheckBoxDefaultValue()
        return
      }
      if (this.data.options.defaultValue instanceof Array) {
        this.getCheckBoxDefaultValue()
      }

      this.saveFormData()
    },
    getCheckBoxDefaultValue() {
      this.data.options.defaultValue = this.checkBoxDefaultValueId.map(m => {
        const arr = this.data.options.options.filter(f => f.id === m)
        if (arr.length) {
          return arr[0].value
        }
      })
    },
    // // 复选框默认值Change
    checkBoxDefaultValueChange(val) {
      this.data.options.defaultValue = this.data.options.defaultValue.filter(f => !!f)
      this.checkBoxDefaultValueId = this.data.options.defaultValue.map(m => {
        const arr = this.data.options.options.filter(f => f.value === m)
        if (arr.length) {
          return arr[0].id
        }
      })
    },
    dealAllAndManagerRole(val) {
      const oldArr = this.data.roles ? this.data.roles.split(',') : ['0']
      if (!val.length) {
        return
      }
      // ['0'],['1'],['0', '1'], ['0', 其他], ['1', 其他], [其他]
      if (val.includes('0') || val.includes('1')) {
        if (val.includes('0') && val.includes('1')) {
          if (oldArr.includes('0')) {
            this.data.roles = '1'
          }
          if (oldArr.includes('1')) {
            this.data.roles = '0'
          }
        } else {
          if (val.includes('0')) {
            if (!oldArr.includes('0')) {
              this.data.roles = '0'
            } else {
              this.data.roles = val.filter(m => m !== '0').join(',')
            }
          } else {
            if (!oldArr.includes('1')) {
              this.data.roles = '1'
            } else {
              this.data.roles = val.filter(m => m !== '1').join(',')
            }
          }
        }
      } else {
        this.data.roles = val.join(',')
      }
    },
    setRole(val) {
      this.dealAllAndManagerRole(val)
      this.saveFormData()
    },
    setMinWidthEmpty(val) {
      // 无数据的情况下，给请选择提示设置最小宽度
      const domEmpty = document.getElementsByClassName('el-select-dropdown__list')
      if (domEmpty.length > 0) {
        domEmpty[0].style['width'] = '280px'
      }
    },
    limitChange() {
      if (!this.data.options.limit) {
        this.data.options.limit = 5
      }
      this.saveFormData()
    },
    fileSizeChange() {
      if (!this.data.options.fileSize) {
        this.data.options.fileSize = 50
      }
      this.saveFormData()
    },
    handlMemberTypeChange(val) {
      if (val) {
        this.data.options.defaultValue = []
      } else {
        this.data.options.defaultValue = ''
      }
      this.memberKey++
      this.saveFormData()
    },
    // 切换地理区域显示类型
    handleCascaderChange(val) {
      this.data.options.defaultValue = []
      this.saveFormData()
    },
    // 切换日期组件类型
    handleDateChange(val) {
      this.data.options.defaultValue = ''
      if (val === 'date') {
        this.data.options.format = 'yyyy年MM月dd日'
      } else {
        this.data.options.format = 'yyyy-MM-dd HH:mm:ss'
      }
      this.saveFormData()
    },
    handlerShowDel(item) {
      return !(this.$store.state.components.currentFields.filter(item => item.required).map(item => item.fieldId).indexOf(item.dataKey) > -1)
    },
    handlerShowDisabled(item) {
      if (item.type === 'input' ||
        item.type === 'textarea' ||
        item.type === 'number' ||
        item.type === 'date' ||
        item.type === 'radio' ||
        item.type === 'checkbox' ||
        item.type === 'member' ||
        item.type === 'switch' ||
        item.type === 'autonumber' ||
        item.type === 'cascader' ||
        item.type === 'imgupload' ||
        item.type === 'fileupload' ||
        item.type === 'relatedChoice') {
        if (this.data.options.header.map(item => item.dataKey).indexOf(item.fieldId) > -1) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    handleOptionsRemove(index) {
      if (this.data.type === 'grid') {
        [this.data.columns].splice(index, 1)
      } else if (this.data.type === 'tabs') {
        this.data.tabs.splice(index, 1)
      } else if (this.data.type === 'relatedForm') {
        // 关联表单表头弹窗删除
        this.data.options.header.splice(index, 1)
      } else {
        // if (!this.data.options.remote && this.data.options.options[index].value) {
        // this.data.options.defaultValue = typeof this.data.options.defaultValue === 'string' ? '' : []
        // }

        this.data.options.options.splice(index, 1)
      }

      // console.log(this.data.options.header)
      this.saveFormData()
    },
    handlePreset() {
      // this.$emit('update:',true)
    },
    // 获取单选项 复选项 现有最大值
    getMax() {
      let arr = []
      this.data.options.options.forEach(item => {
        if (item.label.indexOf('新选项') === 0) {
          //  以新选项开头的label
          arr.push(parseInt(item.label.substr(3)))
        }
      })
      arr = arr.filter(f => !isNaN(f))
      let max = 0
      if (arr.length) {
        max = Math.max.apply(null, arr)
      }
      return max
    },
    // 单选项 复选项 新增一条
    handleAddOption() {
      const max = this.getMax()
      const key = new Date().getTime() + ''
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          id: key,
          value: `新选项${max + 1}`,
          label: `新选项${max + 1}`,
          color: '',
          bgColor: ''
        })
      } else {
        this.data.options.options.push({
          id: key,
          value: `新选项${max + 1}`,
          color: '',
          bgColor: ''
        })
      }
      this.saveFormData()
    },
    handleAddColumn() {
      this.data.columns.push({
        span: '',
        list: []
      })
    },
    handleAddTab() {
      const length = this.data.tabs.length

      this.data.tabs.push({
        label: this.$t('fm.config.widget.tab') + (length + 1),
        name: 'tab_' + new Date().getTime(),
        list: []
      })
    },
    generateRule() {
      if(this.data){
        this.data.rules = []
        Object.keys(this.validator).forEach(key => {
          if (this.validator[key]) {
            this.data.rules.push(this.validator[key])
          }
        })
      }

    },
    handleSelectMuliple(value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue]
        } else {
          this.data.options.defaultValue = []
        }
      } else {
        if (this.data.options.defaultValue.length > 0) {
          this.data.options.defaultValue = this.data.options.defaultValue[0]
        } else {
          this.data.options.defaultValue = ''
        }
      }
    },
    // 字数限制
    maxlengthChange(val, old) {
      if (!val) {
        this.data.options.maxlength = 255
      }
      this.saveFormData()
    },
    validateRequired(val) {
      if (val) {
        this.validator.required = {
          required: true,
          message: `${this.data.name}${this.$t('fm.config.widget.validatorRequired')}`,
          trigger: ['change', 'blur']
        }
      } else {
        this.validator.required = null
      }

      this.$nextTick(() => {
        this.generateRule()
      })
    },
    validateDataType(val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.type = { type: val, message: this.data.name + this.$t('fm.config.widget.validatorType'), trigger: ['change', 'blur'] }
      } else {
        this.validator.type = null
      }
      this.generateRule()
    },
    valiatePattern(val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.pattern = { pattern: val, message: this.data.name + this.$t('fm.config.widget.validatorPattern'), trigger: ['change', 'blur'] }
      } else {
        this.validator.pattern = null
      }
      this.generateRule()
    },
    htmlEditorDialog() {
      this.htmlEditorDialogVisible = true
    },
    htmlEditorDialogClose() {
      this.saveFormData()
      this.htmlEditorDialogVisible = false
    },
    onEditorBlur() {
      // this.saveFormData()
    },
    // 自编号保存
    saveAutoNumber() {
      if (!this.autoNumberDialog.autoNumberPrefix || this.autoNumberDialog.autoNumberValue === undefined) {
        this.$message.warning('前缀和起始值不能为空！')
        return false
      }
      this.data.options.autoNumberPrefix = this.autoNumberDialog.autoNumberPrefix
      this.data.options.autoNumberValue = this.autoNumberDialog.autoNumberValue
      this.autoNumberDialog.autoNumberFlag = false
      this.saveFormData(0, this.data, this.data)
    },
    // 删除自编号
    deleteAutoNumber() {
      // 等待接口
      formFieldDelete(this.data.dataKey).then(resp => {
        this.getCurPageCompsData()
        this.autoNumberDialog.autoNumberFlag = false
      })
    },
    // todo-------------------成员组件选择范围弹窗----------------
    async openMenberRange() {
      this.memberDialog.memberOptions[0].options = []
      this.memberDialog.memberOptions[1].options = []
      if (this.data.options.memberRange.departmentIds.length || this.data.options.memberRange.userIds.length) {
        this.data.options.memberRange.departmentIds.forEach(item => {
          this.memberDialog.memberRange.push('部门-' + item)
        })
        this.data.options.memberRange.userIds.forEach(item => {
          this.memberDialog.memberRange.push('成员-' + item)
        })
      }
      this.memberDialog.memberOptions = [
        { label: '部门', options: [] },
        { label: '成员', options: [] }
      ],
      await this.getDepartments()
      await this.focusData()
      this.memberDialog.visible = true
    },
    async getDepartments() {
      this.memberDialog.memberOptions[0].options = []
      const res = await searchDepartments({ companyId: getCompanyId() })
      const body = res.body && res.body.data || []
      body.forEach(item => {
        this.memberDialog.memberOptions[0].options.push({
          label: item.departmentName,
          value: item.id
        })
      })
    },
    async loadMore() {
      if (this.memberDialog.memberOptions[1].options.length >= this.memberDialog.userTotal) {
        return
      }
      this.$set(this.memberDialog.userSearch, 'page', this.memberDialog.userSearch.page + 1)
      this.memberDialog.loading = true
      // 请求数据方法
      const { records } = await this.getUser()
      const arr = []
      records.forEach(item => {
        arr.push({
          label: item.name,
          value: item.userId
        })
      })
      this.memberDialog.memberOptions[1].options = [
        ...this.memberDialog.memberOptions[1].options,
        ...arr
      ]
      this.memberDialog.loading = false
    },
    async remoteMethod(query) {
      this.memberDialog.memberOptions[1].options = []
      this.memberDialog.loading = true
      this.memberDialog.userSearch.page = 1
      this.memberDialog.userSearch.likeName = query
      const { records, totalRecord } = await this.getUser()
      records && records.forEach(item => {
        this.memberDialog.memberOptions[1].options.push({
          label: item.name,
          value: item.userId
        })
      })
      this.memberDialog.userTotal = totalRecord
      this.memberDialog.loading = false
    },
    async focusData() {
      this.memberDialog.memberOptions[1].options = []
      this.memberDialog.userSearch.page = 1
      this.memberDialog.userSearch.likeName = ''
      const { records, totalRecord } = await this.getUser()
      this.memberDialog.userTotal = totalRecord
      records.forEach(item => {
        this.memberDialog.memberOptions[1].options.push({
          label: item.name,
          value: item.userId
        })
      })
    },
    async getUser() {
      const params = {
        ...this.memberDialog.userSearch
      }
      const res = await userSearchList(params)
      return res.body
    },
    // 关闭弹窗
    cancelDialog() {
      this.memberDialog.memberRange = []
      this.memberDialog.visible = false
    },
    // 保存成员范围设置
    saveMemberRange() {
      this.data.options.memberRange = {
        departmentIds: [],
        userIds: []
      }
      this.memberDialog.memberRange.forEach(item => {
        const key = item.split('-')[0]
        const value = item.split('-')[1]
        if (key === '部门') {
          this.data.options.memberRange.departmentIds.push(value)
        } else {
          this.data.options.memberRange.userIds.push(value)
        }
      })
      if (this.data.options.multiple) {
        this.data.options.defaultValue = []
      } else {
        this.data.options.defaultValue = ''
      }
      this.memberKey++
      this.cancelDialog()
      this.saveFormData()
    },
    colorSelect(command) {
      const indexArr = command.split(',')
      const selectColors = this.colorArr[indexArr[1]]
      this.data.options.options[indexArr[0]].color = selectColors.color
      this.$set(this.data.options.options[indexArr[0]], 'color', selectColors.color)
      this.data.options.options[indexArr[0]].bgColor = selectColors.rgba
      this.saveFormData()
    },
    showExpressionDialog() {
      this.showExpression = true
    },
    saveExpression(expressionData) {
      this.$set(this.data.options, 'expressionData', expressionData)
      // this.data.options.defaultValue = expressionData.expression
      this.saveFormData()
    },
    cancelExpression() {
      console.log('cancelExpression')
    },
    // 为空 || 不为空取消filedValues的校验
    clearValidate(obj) {
      this.$refs.relatedFormFilterData.clearValidate('workflowFilterDtoList.' + obj.sectionIndex + '.conditionDtoList.' + obj.rowIndex + '.fieldValues')
    },
    showFieldType: showFieldTypeDesc
  }
}
</script>
<style lang="scss" scoped>
  .headerLi{padding:5px 35px 5px 0px}
  .relatedChoiceFormName { float:right; font-weight:normal; font-size:12px; color:#A9AFB5; }
  .removeFields { margin:15px 0 0 20px; color:#A9AFB5; }
  .widgetConfigWrap .navTitle { margin-top:20px; font-weight:bold; line-height:20px; font-size:13px; color:#232E37; }
  .widgetConfigWrap .subTitlePro { margin-bottom:0; line-height:30px; font-size:12px; font-weight:normal; color:#232E37; }

  .el-select,.el-input-number{width: 100%;}
  .el-form-item--small.el-form-item{margin-bottom: 0;}
  /deep/.el-form-item__label, /deep/.el-checkbox__label{color: #232E37;line-height: 20px;font-size: 12px;font-weight: 400;margin-bottom: 3px;}
  .subTitle{font-weight: 500 !important;margin-top: 10px;}
  /deep/.el-input-number .el-input__inner{text-align: left;height: 32px;}
  .iconmove:before{position: absolute;top: 5px;}
  .preset{position: absolute;top: -30px;right: 30px;}
  .el-button--default{color:unset;}
  .el-button{min-width: unset}
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {width: 100%;}
  ul:has(.iconBox){width: 200px;}
  .inputNumber { margin:0 5px; width:70px; height:40px; }
  .imgNumber { font-size:12px; color:#A9AFB5; }
  .imgNumber span { margin-right:10px; color:#232E37; }
  .imgNumber i { font-style:normal; }
  .memberRange{display:inline-block;display: flex;justify-content:space-between;
    background-color: #fff;color:#C0C4CC;height: 32px;line-height: 32px;padding: 0 10px;cursor: pointer;}
  .circle-icon{width: 15px; height: 15px; border-radius: 15px; border:1px solid #dedede;display: inline-block;margin-top:9px;}
  .el-dropdown-menu__item .circle{width:15px; height:15px;border-radius: 15px;margin-top:3px;float:left;}
  .el-dropdown-menu .el-dropdown-menu__item:nth-child(1) .circle{border:1px solid #dedede;}
  .el-dropdown-menu .el-dropdown-menu__item{padding:8px 10px;}
  .iconfunctions{cursor: pointer;}
  .express-content .right{
    .r-top{padding:6px 20px; background: #ffffff;
      .el-button{background:#f7f8f9;border:none;}
    }
    .r-content{height: 410px;background: #f7f8f9;}
    .r-footer {text-align: right;padding:20px 20px 0 0;border-top:1px solid #e5e5e5;}
  }
  .expression-collapse{height:475px;overflow-y: scroll;}
  .textareaIcon {
    float: left;
    margin-left: 4px;
  }
  .textareaInput {
    float: left;
    width: calc(100% - 20px);
  }
</style>
<style>
  .widgetConfigWrap .el-input__inner, .widgetConfigWrap .el-textarea__inner { border:1px solid #F8F9FA; border-radius:2px; }
  .widgetConfigWrap .el-input.is-disabled .el-input__inner { border:1px solid #F8F9FA; background-color:#F3F5F8; color:#A9AFB5; }
  .express-dialog .el-dialog__body{padding: 0!important;}
  .express-content .el-tabs__header{margin:0 !important;}
  .express-content .el-tabs__nav-scroll{padding-left: 65px;}
  .express-content .el-tabs__nav-wrap::after{height:0;}
  .express-content .el-collapse-item__header{padding-left:20px;}
  .express-content .el-collapse-item__content{padding-bottom:0; cursor: pointer;}
  .CodeMirror{background: none !important;height:475px;}
  .panda{color: #FFFFFF; background: #62b199;border-radius: 3px;padding:3px 5px; margin:5px;}
  .panda2{color:red;}
  .CodeMirror pre.CodeMirror-line, .CodeMirror pre.CodeMirror-line-like{line-height:25px;}
</style>
