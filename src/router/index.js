import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/HelloWorld.vue'
//先使用 vue的uuse来使用vueroute
Vue.use(VueRouter)
//定义route路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dept',
    name: 'dept',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/dept.vue')
  },
  {
    path: '/msg',
    name: 'msg',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/msg.vue')
  }
]
//history模式就是我们学的history的go，reward。pushState。replaceState啊等。
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//导出route组件
export default router
