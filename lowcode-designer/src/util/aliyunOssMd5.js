'use strict'
var OSS = require('ali-oss')
export default {
  OssClient() {
    return new Promise((resolve, reject) => {
      try {
        const client = new OSS({
          region: '{region}',
          accessKeyId: '{accessKeyId}',
          accessKeySecret: '{accessKeySecret}',
          bucket: 'sangon-resource'
        })
        resolve(client)
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  },
  ossUploadFileMulti(option, path, name) {
    const file = option.file
    this.OssClient().then(client => {
      const fileName = path + name
      client.multipartUpload(fileName, file, {
        progress: async function(p) {
          const e = {}
          e.percent = Math.floor(p * 100)
          option.onProgress(e)
        },
        partSize: 204800
      }).then(val => {
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
