import { BIO } from '@/util/bio.js'
export const generateFormWorkflow = {
  data() {
    return {

    }
  },
  methods: {
    generateFormResp(body, appId, locationHost, message, fn) {
      // 是否有BODY返回值
      if (body && body.showInfo) {
        // debugger
        this.$message.success(body.showInfo)
        // 是否有跳转 - 有跳转
        if (body.isJump) {
          // 判断是否有工作流的筛选条件，有 - 需要存储
          let from = ''
          if (body.paramObject) {
            // 本地存储参数
            localStorage[BIO.s62to10(appId)] = JSON.stringify(body.paramObject)
            from = '?from=workflow'
          }
          // 窗口打开
          if (body.window) { // 新窗口中打开
            window.open('http://' + locationHost + '/#/' + appId + '/app/' + body.jumpUrl + '' + from, '_blank')
          } else { // 当前窗口打开
            this.$router.push({ path: '/' + appId + '/app/' + body.jumpUrl + '' + from })
            if (body.jumpUrl.includes('report') && body.paramObject) {
              fn('workflow')
            }
          }
        } else {
          // 重新初始化
          fn()
        }
      } else {
        this.$message.success(message)
      }
    }
  }
}
