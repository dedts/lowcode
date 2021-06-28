export default {
  install(Vue) {
    // 防重复点击(指令实现)
    Vue.directive('preventReClick', {
      inserted(el, binding) {
        let timer = null
        el.addEventListener('click', () => {
          if (timer) {
            clearTimeout(timer)
            timer = null
          }
          if (el.disabled !== undefined) {
            if (!el.disabled) {
              el.disabled = true
              timer = setTimeout(() => {
                el.disabled = false
              }, binding.value || 1000)
            }
          } else {
            if (el.style['pointer-events'] !== 'none') {
              el.style['pointer-events'] = 'none'
              timer = setTimeout(() => {
                el.style['pointer-events'] = 'auto'
              }, binding.value || 1000)
            }
          }
        })
      }
    })
  }
}
