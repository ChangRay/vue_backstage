import Vue from 'vue'
import VueRouter from 'vue-router'
// 改造為組件懶加載

// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

// import Users from '../components/Users/Users.vue'
// import Rights from '../components/Rights/Rights.vue'
// import Roles from '../components/Rights/Roles.vue'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/Users/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/Rights/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/Rights/Roles.vue')

// import Cate from '../components/Goods/Cate.vue'
// import Params from '../components/Goods/Params.vue'
// import List from '../components/Goods/List.vue'
const Cate = () => import(/* webpackChunkName: "UseCaters_Params_List" */ '../components/Goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "UseCaters_Params_List" */ '../components/Goods/Params.vue')
const List = () => import(/* webpackChunkName: "UseCaters_Params_List" */ '../components/Goods/List.vue')

// import Add from '../components/Goods/Add.vue'
// import Order from '../components/Order/Order.vue'
// import Report from '../components/Report/Report.vue'
const Add = () => import(/* webpackChunkName: "Add_Order_Report" */ '../components/Goods/Add.vue')
const Order = () => import(/* webpackChunkName: "Add_Order_Report" */ '../components/Order/Order.vue')
const Report = () => import(/* webpackChunkName: "Add_Order_Report" */ '../components/Report/Report.vue')

// 註冊插件全局使用
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

// 掛載路由規則
const router = new VueRouter({
  routes
})

// 設定路由守衛
router.beforeEach((to, from, next) => {
  // 如果訪問login頁直接放行
  if (to.path === '/login') return next()
  // 訪問其他頁面先檢查是否帶有token的session
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果token不存在，跳轉到login頁面
  if (!tokenStr) return next('/login')
  // 如果token存在，放行
  next()
})

// 導出以供入口文件接收並掛載路由規則到vue實例
export default router
