<template>
  <!--accept=".xls,.xlsx,.xlsm,.xlt,.xltx,.xltm,.docx,.doc,.docm,.dotx,.dotm,.dot,.ppt,.wps,.pdf"-->
  <el-upload
    :http-request="fnUploadRequestFiles"
    :on-success="uploadSuccessFiles"
    :before-remove="uploadRemoveFiles"
    :before-upload="beforeFileUpload"
    :on-exceed="numberExceed"
    :limit="limitCount"
    :disabled="isDisabled"
    :file-list="fileList"
    :accept="accept"
    :multiple="multiple"
    action=""
  >
    <el-button :disabled="isDisabled" type="primary" plain icon="el-icon-upload">
      上传文件
    </el-button>
    <span class="additional">{{ tip }}</span>
  </el-upload>
</template>
<script>
import oss from '@/utils/aliyunOssFile'
export default {
  name: 'FileUpload',
  props: {
    limitCount: {
      type: Number,
      default: 999
    },
    tip: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 50
    },
    fileList: {
      type: Array,
      default: () => []
    },
    path: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      arraryFileUrl: []
    }
  },
  mounted() {
    this.arraryFileUrl = this.getUrlArr(this.fileList)
  },
  methods: {
    // 文件超出个数限制时的钩子
    numberExceed() {
      this.$message.error(`只能上传${this.limitCount}个文件`)
    },
    // 抛出路径数组
    getUrlArr(fileList) {
      // debugger
      this.arraryFileUrl = []
      for (let i = 0; i < fileList.length; i++) {
        try {
          if (fileList[i].response !== undefined) {
            const responseName = fileList[i].response.name
            const imgUrl = 'https://res.huberbuy.com/' + responseName
            if (this.arraryFileUrl.indexOf(imgUrl) < 0) {
              // this.arraryFileUrl.push()
              this.arraryFileUrl.push('https://res.huberbuy.com/' + fileList[i].response.name)
            }
          } else {
            this.arraryFileUrl.push(fileList[i].url)
          }
        } catch (e) {
          console.log(e)
        }
      }
      return this.arraryFileUrl
    },
    // 文件上传之前
    beforeFileUpload(file) {
      const fileType = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
      const index = this.accept.indexOf(fileType)
      if (index === -1 && this.accept) {
        this.$message.error('格式错误')
        return false
      }
      const isLt50M = file.size / 1024 < 1024 * this.size
      if (!isLt50M) {
        this.$message.error('文件大小' + this.size + 'MB以下')
        return false
      }
      return true
    },
    // 文件上传成功
    uploadSuccessFiles(response, file, fileList) {
      if (fileList.some(s => s.response)) {
        this.$emit('arrayFileUrl', this.getUrlArr(fileList))
      }
    },
    // 附件提交到服务器
    async fnUploadRequestFiles(option) {
      oss.ossUploadFile(option, this.path)
    },
    // 删除文件附件
    uploadRemoveFiles(file, fileList) {
      let removeUrl = ''
      if (file.response !== undefined) {
        removeUrl = 'https://res.huberbuy.com/' + file.response.name
      } else {
        removeUrl = file.url
      }
      // console.log(this.arraryFileUrl)
      const arr = []
      for (let i = 0; i < this.arraryFileUrl.length; i++) {
        if (this.arraryFileUrl[i] !== removeUrl) {
          arr.push(this.arraryFileUrl[i])
        }
      }
      this.arraryFileUrl = arr
      this.$emit('arrayFileUrl', this.arraryFileUrl)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .additional{margin-left: 30px;font-size: 12px;color: #ccc;}
  /deep/.el-upload{text-align: left}
  /deep/.el-upload-list__item:first-child{margin: 0 !important;}
  /deep/ .el-upload-list__item{line-height: 18px;}
</style>
