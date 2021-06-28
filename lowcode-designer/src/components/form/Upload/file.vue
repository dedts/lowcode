<template>
  <div>
    <el-upload
      :style="{width: width}"
      :disabled="disabled"
      :limit="limit"
      :on-success="uploadSuccessFiles"
      :file-list="list"
      :on-remove="uploadRemoveFiles"
      :before-upload="onBefore"
      :http-request="fnUploadRequestFiles"
      :on-exceed="numberExceed"
      action=""
    >
      <el-button :disabled="disabled" size="small" type="primary">{{ $t('fm.actions.upload') }}</el-button>
      <!--<div v-if="tip" class="el-upload__tip" slot="tip">{{tip}}</div>-->
    </el-upload>
  </div>

</template>

<script>
import oss from '@/util/aliyunOssFile'
export default {
  props: {
    action: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 20
    },
    size: {
      type: Number,
      default: 100
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: this.value,
      arraryFileUrl: []
    }
  },
  watch: {
    value(val) {
      this.list = val
    }
  },
  mounted() {
    this.arraryFileUrl = JSON.parse(JSON.stringify(this.list))
    this.list.forEach(item => {
      item.status = 'success'
    })
  },
  methods: {
    // 文件上传成功
    uploadSuccessFiles(response, file, fileList) {
      if (fileList.some(s => s.response)) {
        this.$emit('input', this.getUrlArr(fileList))
      }
    },
    onBefore(file) {
      const isLt50M = file.size / 1024 < 1024 * this.size
      if (this.size && !isLt50M) {
        this.$message.error('文件大小' + this.size + 'MB以下')
        return false
      }
      return true
    },
    // 上传个数限制
    numberExceed() {
      if (this.limit) {
        this.$message.error(`只能上传${this.limit}个文件`)
      }
    },
    // 附件提交到服务器
    async fnUploadRequestFiles(option) {
      const path = new Date().getTime() + '/'
      oss.ossUploadFile(option, path)
    },
    // 抛出路径数组
    getUrlArr(fileList) {
      for (let i = 0; i < fileList.length; i++) {
        try {
          if (fileList[i].response !== undefined) {
            const responseName = fileList[i].response.name
            const imgUrl = 'https://res.huberbuy.com/' + responseName
            if (this.arraryFileUrl.indexOf(imgUrl) < 0) {
              this.arraryFileUrl.push({
                url: 'https://res.huberbuy.com/' + fileList[i].response.name,
                name: fileList[i].name,
                size: fileList[i].size
              })
            }
          }
        } catch (e) {
          console.log(e)
        }
      }
      return this.arraryFileUrl
    },
    // 移除文件
    uploadRemoveFiles(file, fileList) {
      let removeUrl = ''
      if (file.response !== undefined) {
        removeUrl = 'https://res.huberbuy.com/' + file.response.name
      } else {
        removeUrl = file.url
      }
      const arr = []
      for (let i = 0; i < this.arraryFileUrl.length; i++) {
        if (this.arraryFileUrl[i].url !== removeUrl) {
          arr.push(this.arraryFileUrl[i])
        }
      }
      this.arraryFileUrl = arr
      this.$emit('input', this.arraryFileUrl)
    }
  }
}
</script>
