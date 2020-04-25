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
// 為axios設置默認請求地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 設置vue原型屬性實例(全局通用)
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
