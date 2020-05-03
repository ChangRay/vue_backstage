module.exports = {
  chainWebpack: config => {
    //   production
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')

      // 設置external項   讓webpack不把指定包合併打包減少體積
      // 在html中引入cdn代替
      // 在js中import到指定的包(如: vue)將通過window全局下找尋(cdn引入script中)
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      //   配置html plugins的屬性  來控制模板渲染的內容
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // development
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

      //   配置html plugins的屬性  來控制模板渲染的內容
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
