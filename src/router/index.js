import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login.vue'
import Main from '@/pages/main.vue'
import MenuTable from '@/components/menuTable.vue'
import CreateMenu from '@/components/createMenu.vue'
import TypeTable from '@/components/typeTable.vue'
import OrderTable from '@/components/orderTable.vue'
import HotelTable from '@/components/hotelTable.vue'

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
        {path: '/orderTable',name: '每日订单流水',component: OrderTable},
        {path: '/hotelTable',name: '餐馆详情',component: HotelTable},
      ],
    },
    {
      path: '*',
      name: 'Login',
      component: Login,
    },
  ]
})
