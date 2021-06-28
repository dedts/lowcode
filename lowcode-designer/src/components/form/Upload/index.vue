<template>
  <div class="imgUpload">
    <el-upload
      :file-list="fileList"
      :disabled="disabled"
      :class="{hide: hideUpload}"
      :multiple="multiple"
      :limit="limit"
      :on-preview="handlePictureCardPreview"
      :http-request="fnUploadRequest"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-remove="uploadRemove"
      :on-exceed="numberExceed"
      :before-upload="beforeImageUpload"
      action="action"
      list-type="picture-card"
    >
      <i class="el-icon-plus icon-plus"/>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body>
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>
<script>
import oss from '@/util/aliyunOssImg'
export default {
  name: 'FmUpload',
  props: {
    // fileList
    value: {
      type: Array,
      default: () => []
    },
    // 是否被禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否支持多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 最大上传图片个数
    limit: {
      type: Number,
      default: 20
    },
    // 文件大小
    fileSize: {
      type: Number,
      default: 20
    },
    action: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      arrayImageUrl: [],
      dialogImageUrl: '',
      hideUpload: false,
      fileList: []
    }
  },
  watch: {
    'fileList': {
      handler(val) {
        this.arrayImageUrl = this.getUrlArr(val)
        this.$emit('input', this.arrayImageUrl)
      },
      deep: true,
      immediate: true
    }
    // 'value': {
    //   handler(val) {
    //     this.fileList = []
    //     val.forEach(item => {
    //       this.fileList.push({ url: item })
    //     })
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  mounted() {
    if (this.value.length) {
      this.fileList = []
      this.value.forEach(item => {
        this.fileList.push({ url: item })
      })
    }
    if (this.fileList.length > 0) {
      this.arrayImageUrl = this.getUrlArr(this.fileList)
    }
    if (this.fileList.length >= this.limit) {
      this.hideUpload = true
    }
  },
  methods: {
    // 图片上传
    // -- 图片上传 --
    // 图片超出个数限制时的钩子
    numberExceed() {
      this.$message.error(`只能上传${this.limit}张图片`)
    },
    // 上传前验证
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpg'
      const isJPEG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt50M = file.size / 1024 < 1024 * this.fileSize
      if (!(isJPG || isPNG || isJPEG || isGIF)) {
        this.$message.error('图片只限JPG、JPEG、PNG、GIF格式的文件')
        return false
      }
      if (!isLt50M) {
        this.$message.error(`图片文件大小${this.fileSize}MB以下`)
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
            const imgUrl = 'https://res.huberbuy.com/' + fileList[i].response.name
            if (this.arrayImageUrl.indexOf(imgUrl) < 0) {
              this.arrayImageUrl.push(imgUrl)
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
        this.$emit('input', this.getUrlArr(fileList))
        this.hideUpload = fileList.length >= this.limit
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
      this.hideUpload = fileList.length > this.limit
      this.$emit('input', this.arrayImageUrl)
    },
    // 错误提示
    uploadError(err) {
      console.log(err)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .hide /deep/.el-upload--picture-card { display:none; }
  /deep/ .el-dialog { margin-bottom:10vh; margin-top:10vh!important;}
  /deep/ .el-dialog__header { height:40px; }
  /deep/.el-upload--picture-card { width:120px; height:120px; line-height:120px; }
  /deep/.el-upload-list--picture-card .el-upload-list__item{ width:120px; height:120px; }
</style>
