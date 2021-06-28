import { formPagePublish } from '@/api/builder'
import { getAppId, getCompanyId } from '@/util/auth'
import { BIO } from '@/util/bio'
export default {
  methods: {
    // 保存提交版本
    publish() {
      formPagePublish(getAppId()).then((res) => {
        localStorage.setItem('refresh', '0')
        // 判断正式开发环境还是测试环境
        window.location.href = process.env.VUE_APP_COMPANY_API + BIO.tenTo62(getCompanyId()) + '/company/index'
        // if (process.env.NODE_ENV === 'development') {
        //   window.location.href = 'http://localhost:9595/#/' + BIO.tenTo62(getCompanyId()) + '/company/index'
        // } else {
        //   window.location.href = 'https://company.sangon.net/#/' + BIO.tenTo62(getCompanyId()) + '/company/index'
        // }
      })
    }
  }
}
