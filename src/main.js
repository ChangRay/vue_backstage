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
