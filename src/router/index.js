import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/components/login/login"
import Home from "@/components/home/home"
import Users from "@/components/users/users"
import Rights from "@/components/rights/right.vue"
import Role from "@/components/role/role.vue"
import Goodslist from "@/components/goods/goodslist.vue"
import GoodsAdd from "@/components/goods/goodsadd.vue"
import Cateparams from "@/components/goods/cateparams.vue"
import Goodscate from "@/components/goods/goodsCate.vue"
import Order from "@/components/orders/order.vue"
import Reports from "@/components/reports/report.vue"

import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [{
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/',
      component: Home,
      children: [{
          name: 'users',
          path: '/users',
          component: Users,
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Role
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goodslist
        },
        {
          name: 'goodsadd',
          path: '/goodsadd',
          component: GoodsAdd
        },
        {
          name: 'params',
          path: '/params',
          component: Cateparams
        },
        {
          name: 'categories',
          path: '/categories',
          component: Goodscate
        },                        
        {
          name: 'orders',
          path: '/orders',
          component: Order
        },                        
        {
          name: 'reports',
          path: '/reports',
          component: Reports
        }                        
      ]
    },
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  //console.log(to)
  //console.log(from)
  if (to.path === "/login") {
    next()
  }else {
    const token = localStorage.getItem('token')
    if(!token){
      Message.warning('回到登陆页')
      router.push({
        name:'Login'
      })
      return
    }
    next()
  }
})

export default router
