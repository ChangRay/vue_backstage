import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users/Users.vue'

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
      { path: '/users', component: Users }
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

export default router
