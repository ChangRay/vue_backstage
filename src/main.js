import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入axios並設置vue原型屬性實例(全局通用)
import axios from 'axios'
// 引入element
import './plugins/element.js'
// 導入全局樣式
import './assets/css/base.scss'
// 導入字體圖標
import './assets/fonts/iconfont.css'
// 導入vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'

// 導入富文本編輯器  並 全局註冊組件
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)

// 全局過濾器  調用時在過濾的值後面加上 |   value | filterName
Vue.filter('dateformat', function(originValue) {
  // 時間戳 to 日期
  const date = new Date(originValue)

  const y = date.getFullYear()
  // + ''  轉String  padStart如果不滿指定長度，用0填充在前面
  // 月份值從0開始
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDate() + '').padStart(2, '0')

  const hh = (date.getHours() + '').padStart(2, '0')
  const mm = (date.getMinutes() + '').padStart(2, '0')
  const ss = (date.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 全局註冊自定義組件
Vue.component('TreeTable', TreeTable)

// 為axios設置默認請求地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 為axios的所有請求設置攔截器(預先處理在pass請求給服務器 = 中間件的概念)
axios.interceptors.request.use(config => {
  console.log(config)
  // 配置請求頭 - Authorization
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 返回加工過的請求(必須)
  return config
})
// 設置vue原型屬性實例(全局通用)
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
