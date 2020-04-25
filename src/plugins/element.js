import Vue from 'vue'
// 導入組件 - 掛載到Vue.use全局使用
// 導入方法 - 掛載到Vue.prototype全局使用
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.prototype.$message = Message
