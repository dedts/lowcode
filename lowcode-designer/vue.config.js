const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  productionSourceMap: false,
  publicPath: './',
  devServer: {
    host: 'localhost',
    port: 8080,
    // open: true, //配置自动启动浏览器
    proxy: {
      '/dev': {
        target: process.env.VUE_APP_GLOBAL_API, // 对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/dev': '/'
        }
      },
      '/prod': {
        target: process.env.VUE_APP_GLOBAL_API,
        changeOrigin: true,
        pathRewrite: {
          '^/prod': '/'// 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      }
    }
  },
  configureWebpack: config => {
    config['devtool'] = 'source-map'
    const plugins = [
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false,
            drop_debugger: false
            // drop_console: true
          }
        },
        sourceMap: false,
        parallel: true
      })
    ]
    if (process.env.NODE_ENV !== 'development') {
      config.plugins = [...config.plugins, ...plugins]
      config.performance = {
        hints: 'warning',
        // 入口起点的最大体积 整数类型（以字节为单位）
        maxEntrypointSize: 50000000,
        // 生成文件的最大体积 整数类型（以字节为单位 300k）
        maxAssetSize: 30000000,
        // 只给出 js 文件的性能提示
        assetFilter: function(assetFilename) {
          return assetFilename.endsWith('.js')
        }
      }
    }
  }

}
