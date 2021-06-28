<template>
  <div>
    <el-upload
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :http-request="fnUploadRequest"
      :on-error="uploadError"
      :class="['avatar-uploader', border?'avatar-border':'']"
      action=""
      accept=".png,.jpg,.gif,.jpeg"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <span :class="['avatar-icon',imageUrl?'avatar-img-icon':'']">
        <i class="el-icon-edit avatar-uploader-icon" />
        <div class="icon-text">{{ text }}</div>
      </span>
    </el-upload>
  </div>
</template>
<script>
import oss from '@/utils/aliyunOssImg'
export default {
  name: 'Avater',
  props: {
    imageUrl: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: '编辑'
    },
    size: {
      type: Number,
      default: 50
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
    // 上传头像成功
    handleAvatarSuccess(res, file) {
      if (file.response) {
        this.$emit('update:imageUrl', res.url)
      }
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    async fnUploadRequest(option) {
      oss.ossUploadFile(option)
    },
    // 错误提示
    uploadError(err) {
      console.log(err)
    },
    // 上传头像验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpg'
      const isJPEG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < this.size
      if (!(isJPG || isPNG || isJPEG || isGIF)) {
        this.$message.error('图片只限JPG、JPEG、PNG、GIF格式的文件')
        return false
      }
      if (!isLt2M) {
        this.$message.error(`图片文件大小${this.size}MB以下`)
        return false
      }
      return true
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.avatar-uploader /deep/.el-upload {
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: #efefef;
  vertical-align: top;
}
.avatar-border{
  border: 4px solid #fff;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.1);
}
.avatar-icon{background-color: rgba(0, 0, 0, 0.1);display: inline-block;width: 140px;height: 140px;}
.avatar-img-icon{position: absolute;top: 0px;left: 0px;}
.avatar-uploader-icon {font-size: 20px;color: #fff;line-height: 90px;}
.icon-text{font-size: 14px;color: #fff;}
.avatar {width: 140px;height: 140px;display: block;border-radius: 4px;}
</style>
