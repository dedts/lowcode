'use strict'
import { formatDate } from './index'
var OSS = require('ali-oss')
export default {
  /**
   * 创建随机字符串
   * @param num
   * @returns {string}
   */
  randomString(num) {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let res = ''
    for (let i = 0; i < num; i++) {
      var id = Math.ceil(Math.random() * 35)
      res += chars[id]
    }
    return res
  },
  OssClient() {
    return new Promise((resolve, reject) => {
      try {
        const client = new OSS({
          region: '{region}',
          accessKeyId: '{accessKeyId}',
          accessKeySecret: '{accessKeySecret}',
          bucket: '{bucket-upload}'
        })
        resolve(client)
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  },
  ossUploadFile(option) {
    const file = option.file
    const self = this
    this.OssClient().then(client => {
      const date = formatDate(new Date(), 'yyyyMMdd') // 当前时间
      const dateTime = formatDate(new Date(), 'yyyyMMddhhmmss') // 当前时间
      const randomStr = self.randomString(4)//  4位随机字符串
      const extensionName = file.name.substr(file.name.indexOf('.')) // 文件扩展名
      const fileName = 'sendinquiry/' + date + '/' + dateTime + '_' + randomStr + extensionName // 文件名字（相对于根目录的路径 + 文件名）
      client.put(fileName, file).then(val => {
        option.onSuccess(val)
      }).catch(err => {
        option.onError(err)
      })
    }).catch(err => {
      console.log(err)
    })
  },
  ossUploadFileMulti(option) {
    const file = option.file
    const self = this
    this.OssClient().then(client => {
      const date = formatDate(new Date(), 'yyyyMMdd') // 当前时间
      const dateTime = formatDate(new Date(), 'yyyyMMddhhmmss') // 当前时间
      const randomStr = self.randomString(4)//  4位随机字符串
      const extensionName = file.name.substr(file.name.indexOf('.')) // 文件扩展名
      const fileName = 'sendinquiry/' + date + '/' + dateTime + '_' + randomStr + extensionName // 文件名字（相对于根目录的路径 + 文件名）
      client.multipartUpload(fileName, file, {
        progress: async function(p) {
          const e = {}
          e.percent = Math.floor(p * 100)
          option.onProgress(e)
        },
        partSize: 204800
      }).then(val => {
        console.log(val)
        if (val.res.statusCode === 200) {
          option.onSuccess(val)
        } else {
          option.onError(val)
        }
      }, err => {
        option.onError(err)
      })
    }).catch(err => {
      console.log(err)
    })
  }
}
