// 获取加工服务
import { processCraft, secondProcessCraft } from '@/api/inquiry'
export const processCraftList = cb => {
  processCraft().then(resp => {
    // debugger
    let process = []
    if (resp.errorCode === 0) {
      process = resp.result
      secondProcessCraft().then(resp => {
        if (resp.errorCode === 0) {
          process.push(...resp.result)
          cb && cb(process)
        } else {
          this.$message.error('加工服务获取失败')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('加工服务获取失败')
      })
    } else {
      this.$message.error('加工服务获取失败')
    }
  }).catch(error => {
    console.log(error)
    this.$message.error('加工服务获取失败')
  })
}

/**
 * TODO -- 下拉框过滤 --
 * @param selectModelArray  包含每一行内容的数组  []
 * @param selectSourcesArray 下拉列表的数组 []
 * @param selectDkey select绑定的值 String
 * @param selectDkey options v-show绑定的值 String
 */
export function selectFilter(selectModelArray, selectSourcesArray, selectDkey, vShow) {
  const tempArr = []
  selectModelArray.forEach(item => {
    const arr = selectSourcesArray.filter(f => f.dKey === item[selectDkey])
    tempArr.push(arr[0])
  })
  selectSourcesArray.forEach(item => {
    item[vShow] = true
  })
  tempArr.forEach(item => {
    if (item !== undefined) {
      item[vShow] = false
    }
  })
}
