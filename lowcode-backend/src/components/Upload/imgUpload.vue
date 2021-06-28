<template>
  <div>
    <el-upload
      :multiple="true"
      :limit="limitCount"
      :class="{hide:hideUpload}"
      :on-preview="handlePictureCardPreview"
      :http-request="fnUploadRequest"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-remove="uploadRemove"
      :on-exceed="numberExceed"
      :before-upload="beforeImageUpload"
      :file-list="fileList"
      :disabled="isDisabled"
      action=""
      list-type="picture-card"
    >
      <i class="el-icon-plus icon-plus" />
      <span class="text">上传</span>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body>
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>
<script>
import oss from '@/utils/aliyunOssImg'
export default {
  name: 'ImgUpload',
  props: {
    fileList: { // 展示图片数组
      type: Array,
      default: () => []
    },
    limitCount: {
      type: Number,
      default: 5
    },
    size: {
      type: Number,
      default: 5
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      arrayImageUrl: [],
      dialogImageUrl: '',
      hideUpload: false
    }
  },
  watch: {
    'fileList': {
      handler(val) {
        // this.fileList = val
        this.arrayImageUrl = this.getUrlArr(this.fileList)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (this.fileList.length > 0) {
      this.arrayImageUrl = this.getUrlArr(this.fileList)
    }
    if (this.fileList.length >= this.limitCount) {
      this.hideUpload = true
    }
  },
  methods: {
    // 图片上传
    // -- 图片上传 --
    // 图片超出个数限制时的钩子
    numberExceed() {
      this.$message.error(`只能上传${this.limitCount}张图片`)
    },
    // 上传前验证
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpg'
      const isJPEG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt50M = file.size / 1024 < 1024 * this.size
      if (!(isJPG || isPNG || isJPEG || isGIF)) {
        this.$message.error('图片只限JPG、JPEG、PNG、GIF格式的文件')
        return false
      }
      if (!isLt50M) {
        this.$message.error(`图片文件大小${this.size}MB以下`)
        return false
      }
      return true
    },
    // 上传图片时候展示图片
    handlePictureCardPreview(file) {
      // console.log(this.arrayImageUrl)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 抛出路径数组
    getUrlArr(fileList) {
      this.arrayImageUrl = []
      for (let i = 0; i < fileList.length; i++) {
        try {
          if (fileList[i].response !== undefined) {
            const responseName = fileList[i].response.name
            // console.log(fileList[i].response)
            const imgUrl = 'https://res.huberbuy.com/' + responseName
            if (this.arrayImageUrl.indexOf(imgUrl) < 0) {
              // this.arrayImageUrl.push()
              this.arrayImageUrl.push('https://res.huberbuy.com/' + fileList[i].response.name)
            }
          } else {
            this.arrayImageUrl.push(fileList[i].url)
          }
        } catch (e) {
          console.log(e)
        }
      }
      return this.arrayImageUrl
    },
    // 上传成功后
    uploadSuccess(response, file, fileList) {
      if (fileList.some(s => s.response)) {
        this.$emit('arrayImageUrl', this.getUrlArr(fileList))
        this.hideUpload = fileList.length >= this.limitCount
      }
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    async fnUploadRequest(option) {
      oss.ossUploadFile(option)
    },
    // 删除图片
    uploadRemove(file, fileList) {
      let removeUrl = ''
      if (file.response !== undefined) {
        removeUrl = 'https://res.huberbuy.com/' + file.response.name
      } else {
        removeUrl = file.url
      }
      const arr = []
      for (let i = 0; i < this.arrayImageUrl.length; i++) {
        if (this.arrayImageUrl[i] !== removeUrl) {
          arr.push(this.arrayImageUrl[i])
        }
      }
      this.arrayImageUrl = arr
      this.hideUpload = fileList.length > this.limitCount
      this.$emit('arrayImageUrl', this.arrayImageUrl)
    },
    // 错误提示
    uploadError(err) {
      console.log(err)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .hide /deep/.el-upload--picture-card {display: none;}
  /deep/ .el-dialog{margin-bottom: 10vh;margin-top: 10vh!important;}
  /deep/ .el-dialog__header{height: 40px;}
  /deep/.el-icon-plus:before{position: relative;top: -5px;}
  /deep/.el-upload--picture-card{width: 120px !important;height: 120px !important;}
  /deep/.el-upload-list--picture-card .el-upload-list__item{width: 120px !important;height: 120px !important;}
  .text{font-size: 14px;color: rgba(0, 0, 0, 0.65);
    position: relative;bottom: -10px;left: -18px;}
  .icon-plus{position: relative;top: -20px;left: 12px;}
</style>
