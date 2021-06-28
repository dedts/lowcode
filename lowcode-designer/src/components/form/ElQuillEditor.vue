<template>
  <div class="quillWrap" style="position: relative;">
    <el-upload
      :http-request="fnUploadRequestImage"
      :on-success="uploadImageSuccessFiles"
      :before-upload="beforeImageUpload"
      style="display: none"
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF">
      <i id="uploadImageBtn" />
    </el-upload>
    <el-upload
      :http-request="fnUploadRequestVideo"
      :on-success="uploadVideoSuccessFiles"
      :before-upload="beforeVideoUpload"
      style="display: none"
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      accept=".mp4">
      <i id="uploadVideoBtn" />
    </el-upload>
    <quill-editor
      id="fm-editor"
      ref="ElQuillEditor"
      v-model="dataModel"
      :options="formatEditorToolbar"
      class="fm-editor"
      @input="$emit('input', dataModel)"
      @change="onEditorChange($event)"
    />
    <span v-if="maxlength" style="position: absolute;bottom: 0;right: 10px">{{ length }}/{{ maxlength }}</span>
  </div>
</template>
<script>
import SparkMD5 from 'spark-md5'
import oss from '@/util/aliyunOssMd5'
import { getAppId } from '@/util/auth.js'
const handlers = {
  image: function(value) {
    var self = this
    if (value) {
      // 调用iview图片上传
      document.querySelector('#uploadImageBtn').click()
    } else {
      this.quill.format('image', false)
    }
  },
  video: function(value) {
    var self = this
    if (value) {
      // 调用iview图片上传
      document.querySelector('#uploadVideoBtn').click()
    } else {
      this.quill.format('video', false)
    }
  }
}
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
  ['blockquote', 'code-block'], // 引用，代码块
  [{ 'header': 1 }, { 'header': 2 }, { 'header': [1, 2, 3, 4, 5, 6, false] }], // 标题，键值对的形式；1、2表示字体大小
  [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 列表
  [{ 'script': 'sub' }, { 'script': 'super' }], // 上下标
  [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
  [{ 'direction': 'rtl' }], // 文本方向
  [{ 'color': [] }, { 'background': [] }, { 'size': ['small', false, 'large', 'huge'] }, { 'font': [] }], // 字体颜色，字体背景颜色, 字体大小,几级标题
  [{ 'align': [] }], // 对齐方式
  ['image', 'video'], // 上传图片、上传视频
  ['clean'] // 清除字体样式
]
const imageUploadConfig = {
  name: 'img', // 必填参数 文件的参数名
  accept: 'image/png, image/gif, image/jpeg' // 可选 可上传的图片格式
}
export default {
  name: 'ElQuillEditor',
  model: {
    prop: 'model',
    // 这个事件名可以随意写，它实际上是规定了子组件要更新父组件值需要注册的方法
    event: 'input'
  },
  props: {
    model: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: function() {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    edit: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number
    },
    rows: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      dataModel: this.model,
      path: 'images/',
      prefix: 'http://resource.sangon.net/',
      length: 0 // 字数
    }
  },
  computed: {
    formatEditorToolbar() {
      const arr = []
      if (this.options.length > 0) {
        for (let i = 0; i < this.options.length; i++) {
          arr.push(toolbarOptions[parseInt(this.options[i])])
        }
      }
      return { modules: { toolbar: { container: arr, handlers: handlers }}, placeholder: this.placeholder ? this.placeholder : '', theme: 'snow' }
    }
  },
  mounted() {
    // 动态设置富文本高度
    console.log(document.getElementById('fm-editor').getElementsByClassName('ql-container')[0])
    document.getElementById('fm-editor').getElementsByClassName('ql-container')[0].style.height = (18 * (this.rows - 1) + 42) + 'px'
  },
  methods: {
    beforeImageUpload(file) {
      const sizeM = file.size / 1024 / 1024
      if (sizeM < 2) {
        return true
      } else {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    beforeVideoUpload(file) {
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (extension !== 'mp4') {
        this.$message.error('只允许上传mp4')
        return false
      }
      const sizeM = file.size / 1024 / 1024
      if (sizeM < 50) {
        return true
      } else {
        this.$message.error('上传视频大小不能超过 50MB!')
        return false
      }
    },
    async fnUploadRequestFiles(option, path) {
      const doIndex = option.file.name.lastIndexOf('.')
      const nameLen = option.file.name.length
      const suffix = option.file.name.substring(doIndex, nameLen)
      const fileReader = new FileReader()
      const spark = new SparkMD5()
      fileReader.readAsBinaryString(option.file)
      fileReader.onload = function(e) {
        spark.appendBinary(e.target.result)
        oss.ossUploadFileMulti(option, path, spark.end() + suffix)
      }
    },
    async fnUploadRequestImage(option) {
      this.fnUploadRequestFiles(option, getAppId() + '/images/')
    },
    async fnUploadRequestVideo(option) {
      this.fnUploadRequestFiles(option, getAppId() + '/video/')
    },
    uploadImageSuccessFiles(response, file, fileList) {
      if (file.response) {
        const res = this.prefix + file.response.name
        // 获取富文本组件实例
        const quill = this.$refs.ElQuillEditor.quill
        // 如果上传成功
        if (res) {
          // 获取光标所在位置
          const length = quill.getSelection().index
          // 插入图片，res为服务器返回的图片链接地址
          quill.insertEmbed(length, 'image', res)
          // 调整光标到最后
          quill.setSelection(length + 1)
        } else {
          // 提示信息，需引入Message
          Message.error('图片插入失败')
        }
      }
    },
    uploadVideoSuccessFiles(response, file, fileList) {
      if (file.response) {
        const res = this.prefix + file.response.name
        // 获取富文本组件实例
        const quill = this.$refs.ElQuillEditor.quill
        // 如果上传成功
        if (res) {
          // 获取光标所在位置
          const length = quill.getSelection().index
          // 插入图片，res为服务器返回的图片链接地址
          quill.insertEmbed(length, 'video', res)
          // 调整光标到最后
          quill.setSelection(length + 1)
        } else {
          // 提示信息，需引入Message
          Message.error('视频插入失败')
        }
      }
    },
    onEditorChange(e) {
      if (!this.maxlength) return
      e.quill.deleteText(this.maxlength, 4)
      this.length = e.quill.getLength() - 1
    }
  }
}
</script>

<style>
.fm-editor .ql-toolbar.ql-snow, .fm-editor .ql-container.ql-snow { border:1px solid #E4E7ED; }
</style>
