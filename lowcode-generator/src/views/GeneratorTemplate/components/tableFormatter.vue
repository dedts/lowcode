<template>
  <div>
    <!--图片-->
    <div v-if="item.type==='imgupload'&& row[item.dataKey]&&row[item.dataKey].length">
      <img v-for="src in row[item.dataKey]" :key="src" :src="src" :preview="row.mongoDataId" style="width: 50px;height: 50px;margin-bottom: 5px;margin-right: 5px;">
    </div>
    <!--文件-->
    <div v-else-if="item.type==='fileupload'&& row[item.dataKey]&&row[item.dataKey].length&&from==='table'">
      <div v-for="f in row[item.dataKey]" :key="f.url">{{ f.name }}</div>
    </div>
    <div v-else-if="item.type==='fileupload'&& row[item.dataKey]&&row[item.dataKey].length&& from==='preview'">
      <div v-for="f in row[item.dataKey]" :key="f.url" class="fileBox">
        <div style="display: flex">
          <i class="iconfont iconcustombtn_file-line fileIcon" />
          <div class="fileContent">
            <span style="font-size: 12px;">{{ f.name }}</span>
            <span style="font-size: 12px;color:#909399">{{ getFileSize(f.size) }}</span>
          </div>

        </div>
        <el-button type="text" class="mr10" @click="download(f.url)">下载</el-button>
      </div>
    </div>
    <!--富文本-->
    <div v-else-if="item.type==='editor'&& row[item.dataKey]">
      <div v-html="row[item.dataKey]"/>
    </div>
    <!--html-->
    <div v-else-if="item.type==='html'&& row[item.dataKey]">
      <div v-html="row[item.dataKey]"/>
    </div>
    <!--开关-->
    <div v-else-if="item.type==='switch'">
      <el-switch :value="!!row[item.dataKey]" disabled/>
    </div>
    <!--自编号-->
    <div v-else-if="item.type==='autonumber'">
      <div v-if="row[item.dataKey]||row[item.dataKey]===0">{{ item.options.autoNumberPrefix }}{{ row[item.dataKey] }}</div>
    </div>
    <!--成员-->
    <div v-else-if="item.type==='member'&&row[item.dataKey]">
      <div v-if="item.options&&item.options.isHoverDetail&&from==='preview'" >
        <span v-for="m in gettableMember(item.dataKey)" :key="m.userId" class="inline mr10">
          <el-tooltip :visible-arrow="false" class="item" effect="light" placement="right-start" popper-class="tooltip">
            <span slot="content">
              <div style="display: flex;justify-content: space-between">
                <div class="mr10">
                  <div>{{ m.name }}</div>
                  <div v-if="m.departmentDto" class="mt10">{{ m.departmentDto.departmentName }}</div>
                  <div class="mt10">{{ m.mobile }}</div>
                  <div class="mt10">{{ m.email }}</div>
                </div>
                <img v-if="m.headPortrait" :src="m.headPortrait" alt="" style="width: 40px;height: 40px;border-radius: 50%;">
              </div>
            </span>
            <span class="curpion">{{ m.name }}</span>
          </el-tooltip>
        </span>
      </div>
      <div v-else>{{ gettableMember(item.dataKey).map(m=>m.name).join(' , ') }}</div>
    </div>
    <!--日期-->
    <div v-else-if="item.type==='date'&&row[item.dataKey]">
      {{ formatTableTime(row[item.dataKey],item.options&&item.options.format || 'yyyy-MM-dd HH:mm:ss') }}
    </div>
    <!--单选项-->
    <div v-else-if="item.type==='radio'&& row[item.dataKey]">
      <span v-for="o in item.options.options" v-if="row[item.dataKey]===o.value" :key="o.value" :style="{color:o.color,'background-color':o.bgColor}" class="tableRadio">{{ row[item.dataKey] }}</span>
    </div>
    <!--复选项-->
    <div v-else-if="item.type==='checkbox'&&row[item.dataKey]&& row[item.dataKey].length">
      <span v-for="d in row[item.dataKey]" :key="d.value" :style="{color:getCheckboxData(d,item.options.options).color,'background-color':getCheckboxData(d,item.options.options).bgColor}" class="tableRadio">{{ getCheckboxData(d,item.options.options).value }}</span>
    </div>
    <!--关联选项-->
    <div v-else-if="item.type==='relatedChoice'">
      <span>{{ getRelatedChoice(item.options,item.dataKey) }}</span>
    </div>
    <div v-else>
      {{ formatter('','',row[item.dataKey]) }}
    </div>
  </div>
</template>
<script>
import { downloadFile, formatTime } from '../../../util/index'
export default {
  props: {
    item: {
      type: Object,
      required: true

    },
    row: {
      type: Object,
      required: true
    },
    from: {
      type: String,
      default: ''
    },
    tableMemberList: { // 成员列表
      type: Array,
      default: () => {
        return []
      }
    },
    relatedChoiceList: { // 关联选项对应设置
      type: Array,
      default: () => {
        return []
      }
    },
    relatedChoiceMongoDataIdsData: { // 关联选项对应表单数据集合
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
  methods: {
    formatter(row, column, cellValue) {
      if (typeof cellValue !== 'string' && typeof cellValue !== 'number') {
        if (cellValue && cellValue.length) {
          return cellValue.join('  ')
        } else {
          return '-'
        }
      } else {
        if (cellValue || cellValue === 0) {
          return cellValue
        } else {
          return '-'
        }
      }
    },
    // 格式化复选框数据
    getCheckboxData(data, options) {
      let obj = {}
      options.forEach(o => {
        if (o.value === data) {
          obj = o
        }
      })
      return obj
    },
    // 格式化文件大小
    getFileSize(size) {
      const fileSize = size / 1000
      if (fileSize < 1000) {
        return fileSize.toFixed() + 'KB'
      } else {
        return (fileSize / 1000).toFixed(2) + 'MB'
      }
    },
    // 格式化时间
    formatTableTime: formatTime,
    download: downloadFile,
    // 成员列表处理
    gettableMember(key) {
      let list = []
      if (typeof this.row[key] === 'string') {
        list = [this.row[key]]
      } else {
        list = JSON.parse(JSON.stringify(this.row[key]))
      }

      const arr = []
      list.forEach(key => {
        this.tableMemberList.forEach(item => {
          if (key === item.userId) {
            arr.push(item)
          }
        })
      })
      return arr
    },
    // 关联选项数据处理
    getRelatedChoice(options, dataKey) {
      const relatedChoiceMongoDataIdsData = JSON.parse(JSON.stringify(this.relatedChoiceMongoDataIdsData))
      let rowData = []
      if (this.row[dataKey]) {
        if (options.choiceType === 'single') {
          rowData = [this.row[dataKey]]
        } else if (options.choiceType === 'multiple') {
          rowData = this.row[dataKey]
        } else {
          rowData = []
        }
      }
      const obj = this.relatedChoiceList.filter(f => f.dataKey === dataKey)[0]
      const mongoDataArr = []
      relatedChoiceMongoDataIdsData.forEach(item => {
        // 处理日期和成员
        Object.keys(item).forEach(k => {
          obj.appointFields.forEach(a => {
            if (a.type === 'date' && k === a.dataKey) {
              if (item[k]) {
                item[k] = this.formatTableTime(item[k], a.options.format)
              } else {
                item[k] = '--'
              }
            }
            if (a.type === 'member' && k === a.dataKey) {
              this.tableMemberList.forEach(t => {
                if (t.userId === item[k][0]) {
                  item[k] = t.name
                }
              })
            }
          })
        })
        // 每个cell 对应的数据放进mongoDataArr
        rowData.forEach(r => {
          if (r === item.mongoDataId) {
            mongoDataArr.push(item)
          }
        })
      })
      // debugger
      let text = ''
      // 拼接数据
      mongoDataArr.forEach(item => {
        let cText = ''
        Object.keys(item).forEach(k => {
          obj.appointFields.forEach(a => {
            if (k === a.dataKey) {
              cText += item[a.dataKey] + '  , '
            }
          })
        })

        cText = cText.slice(0, cText.length - 2)
        text += `「 ${cText} 」 `
      })
      return text
    }
  }
}
</script>
<style>
  .tableRadio{padding: 2px 6px;display: inline-block;border-radius: 4px;margin-bottom: 5px;margin-right: 5px;}
  .fileBox{background-color: #F5F7FA;margin-bottom: 5px;display: flex;justify-content: space-between;padding: 5px 10px;}
  .fileIcon{line-height: 40px;font-size: 30px;color:#606266;}
  .fileContent{display: flex;flex-direction: column;margin-left: 10px;justify-content: center}
</style>
