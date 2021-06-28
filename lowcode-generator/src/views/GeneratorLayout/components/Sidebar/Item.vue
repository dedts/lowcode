<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      iconfont: 'iconfont'
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      const className = icon + ' iconfont menuIcon'
      // vnodes.push(<svg-icon icon-class={icon}/>)
      vnodes.push(<span class={className}/>)
    }

    if (title) {
      vnodes.push(<div slot='title' class='titleText' title={title}>{(title)}</div>)
    }
    return vnodes
  }
}
</script>
<style>
.menuIcon { margin-right:10px; }
.titleText{ width:100px; height:20px; line-height:20px; display:inline-block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
</style>
