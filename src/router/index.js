import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login.vue'
import Main from '@/pages/main.vue'
import MenuTable from '@/components/menuTable.vue'
import CreateMenu from '@/components/createMenu.vue'
import TypeTable from '@/components/typeTable.vue'
import OrderTable from '@/components/orderTable.vue'
import HotelTable from '@/components/hotelTable.vue'
import VipTable from '@/components/vipTable.vue'


const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  base:'/pointpayment/',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path:'/',
      name:'Login',
      component:Login
    },
    {
      path: '/main',
      name: '主页',
      component: Main,
      children:[
        {path: '/typeTable',name: '菜品类别列表',component: TypeTable },
        {path: '/createMenu',name: '新添菜品',component: CreateMenu},
        {path: '/menuTable',name: '菜品列表',component: MenuTable},
        {path: '/orderTable',name: '订单查询',component: OrderTable},
        {path: '/hotelTable',name: '反馈信息',component: HotelTable},
        {path: '/vipTable',name: '用户管理',component: VipTable}
      ],
    },
    {
      path: '*',
      name: 'Login',
      component: Login,
    },
  ]
})
