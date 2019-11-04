import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
//@/指src目录，是Vue内部提供的
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/users/Users.vue'
Vue.use(VueRouter)

const routes = [
 {path:'/',redirect:'/login'},
 {path:'/login',component:Login},
 {path:'/home',component:Home,redirect:'/welcome',children:[
   {path:'/welcome',component:Welcome},
   {path:'/users',component:Users}
 ]}
]

const router = new VueRouter({
  routes
})
//本质就是改写了element内部的push方法
//对错误进行了捕获
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
//导航守卫是为了防止非法登录，如果没有登录是没有权限访问后台首页的（通过token来判断）
router.beforeEach((to,from,next)=>{
  if(to.path=='/login') return next()
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})
export default router
