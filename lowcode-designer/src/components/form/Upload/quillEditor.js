import axios from 'axios'
import { aliyunsts } from '@/api/builder'
export const toolbarOptions = [
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
export const handlers = {
  image: function() {
    var self = this
    var fileInput = this.container.querySelector('input.ql-image[type=file]')
    if (fileInput === null) {
      fileInput = document.createElement('input')
      fileInput.setAttribute('type', 'file')
      if (imageUploadConfig.name) {
        fileInput.setAttribute('name', imageUploadConfig.name)
      }
      // 可设置上传图片的格式
      fileInput.setAttribute('accept', imageUploadConfig.accept)
      fileInput.classList.add('ql-image')
      fileInput.addEventListener('change', function() {
        const pro = new Promise((resolve, rej) => {
          // 判断签名有没有过期
          var signItem = localStorage.getItem('sign')
          if (signItem) {
            var res = JSON.parse(signItem)
            var timestamp = Date.parse(new Date()) / 1000
            if (res && res.expire - 3 > timestamp) {
              resolve(res)
            } else {
              aliyunsts().then(res => {
                if (res.code == 200) {
                  localStorage.setItem('sign', JSON.stringify(res.body))
                  resolve(res.body)
                }
              })
            }
          } else {
            aliyunsts().then(res => {
              if (res.code == 200) {
                localStorage.setItem('sign', JSON.stringify(res.body))
                resolve(res.body)
              }
            })
          }
        })
        pro.then(success => {
          var data = success
          var ossData = new FormData()
          const file = fileInput.files[0]
          ossData.append('name', file.name)
          // key就代表文件层级和阿里云上的文件名
          const imgType = file.type.split('/')[1]
          const filename = file.name + file.size
          const keyValue = data.dir + '/' + filename + '.' + imgType
          ossData.append('key', keyValue)
          ossData.append('policy', data.policy)
          ossData.append('OSSAccessKeyId', data.accessid)
          ossData.append('success_action_status', 201)
          ossData.append('signature', data.signature)
          ossData.append('file', file, file.name)
          axios.post(data.host, ossData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(res => {
            if (res.status == 201) {
              const url = data.host + '/' + keyValue
              const length = self.quill.getSelection(true).index
              // 图片上传成功后，img的src需要在这里添加
              self.quill.insertEmbed(length, 'image', url)
              self.quill.setSelection(length + 1)
            }
            fileInput.value = ''
          }).catch(err => {

          })
        })
      })
      this.container.appendChild(fileInput)
    }
    fileInput.click()
  },
  video: function() {
    var self = this
    var fileInput = this.container.querySelector('input.ql-image[type=file]')
    if (fileInput === null) {
      fileInput = document.createElement('input')
      fileInput.setAttribute('type', 'file')
      if (imageUploadConfig.name) {
        fileInput.setAttribute('name', imageUploadConfig.name)
      }
      // 可设置上传图片的格式
      fileInput.setAttribute('accept', imageUploadConfig.accept)
      fileInput.classList.add('ql-image')
      fileInput.addEventListener('change', function() {
        const pro = new Promise((resolve, rej) => {
          // 判断签名有没有过期
          var signItem = localStorage.getItem('sign')
          if (signItem) {
            var res = JSON.parse(signItem)
            var timestamp = Date.parse(new Date()) / 1000
            if (res && res.expire - 3 > timestamp) {
              resolve(res)
            } else {
              aliyunsts().then(res => {
                if (res.code == 200) {
                  localStorage.setItem('sign', JSON.stringify(res.body))
                  resolve(res.body)
                }
              })
            }
          } else {
            aliyunsts().then(res => {
              if (res.code == 200) {
                localStorage.setItem('sign', JSON.stringify(res.body))
                resolve(res.body)
              }
            })
          }
        })
        pro.then(success => {
          var data = success
          var ossData = new FormData()
          const file = fileInput.files[0]
          ossData.append('name', file.name)
          // key就代表文件层级和阿里云上的文件名
          const imgType = file.type.split('/')[1]
          const filename = file.name + file.size
          const keyValue = data.dir + '/' + filename + '.' + imgType
          ossData.append('key', keyValue)
          ossData.append('policy', data.policy)
          ossData.append('OSSAccessKeyId', data.accessid)
          ossData.append('success_action_status', 201)
          ossData.append('signature', data.signature)
          ossData.append('file', file, file.name)
          axios.post(data.host, ossData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(res => {
            if (res.status == 201) {
              const url = data.host + '/' + keyValue
              const length = self.quill.getSelection(true).index
              // 图片上传成功后，img的src需要在这里添加
              self.quill.insertEmbed(length, 'image', url)
              self.quill.setSelection(length + 1)
            }
            fileInput.value = ''
          }).catch(err => {

          })
        })
      })
      this.container.appendChild(fileInput)
    }
    fileInput.click()
  }
}
