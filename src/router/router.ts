import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: '/',
    component: () => import('@/views/home/home.vue')
  },
  {
    path: '/home',//首页
    name: 'home',
    component: () => import('@/views/home/home.vue')
  },
  {
    path: '/login',//登录页
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/shopping-cart',//购物车
    name: 'shopping-cart',
    component: () => import('@/views/shopping-cart/shopping-cart.vue')
  },
  {
    path: '/personal-center',//个人中心
    name: 'personal-center',
    component: () => import('@/views/personal-center/personal-center.vue')
  },
  {
    path: '/system-notice',//公告
    name: 'system-notice',
    component: () => import('@/views/system-notice/system-notice.vue')
  },
  {
    path: '/notice-details',//公告详情
    name: 'notice-details',
    component: () => import('@/views/notice-details/notice-details.vue')
  },
  {
    path: '/system-leave',//留言
    name: 'system-leave',
    component: () => import('@/views/system-leave/system-leave.vue')
  },
  {
    path: '/product-details',//商品详情
    name: 'product-details',
    component: () => import('@/views/product-details/product-details.vue')
  },
  {
    path: '/product-search',//商品搜索
    name: 'product-search',
    component: () => import('@/views/product-search/product-search.vue')
  },
  {
    path: '/backstage',
    name: 'backstage',
    component: () => import('@/views/backstage/backstage.vue'),
    redirect: { name: 'backstage-home' },
    children: [
      {
        path: 'backstage-home',//系统首页
        name: 'backstage-home',
        component: () => import('@/views/backstage/backstage-home/backstage-home.vue'),
      },
      {
        path: 'category',//类目管理
        name: 'category',
        component: () => import('@/views/backstage/category/category.vue'),
      },
      {
        path: 'category-second',//二级类目
        name: 'category-second',
        component: () => import('@/views/backstage/category-second/category-second.vue'),
      },
      {
        path: 'user',//用户管理
        name: 'user',
        component: () => import('@/views/backstage/user/user.vue'),
      },
      {
        path: 'commodity',//商品管理
        name: 'commodity',
        component: () => import('@/views/backstage/commodity/commodity.vue'),
      },
      {
        path: 'order',//订单管理
        name: 'order',
        component: () => import('@/views/backstage/order/order.vue'),
      },
      {
        path: 'notice',//公告管理
        name: 'notice',
        component: () => import('@/views/backstage/notice/notice.vue'),
      },
      {
        path: 'leave',//留言管理
        name: 'leave',
        component: () => import('@/views/backstage/leave/leave.vue'),
      },
      {
        path: 'quick-search',//快捷搜索
        name: 'quick-search',
        component: () => import('@/views/backstage/quick-search/quick-search.vue'),
      },
    ],
  },
  //路由重定向
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home"
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes, // short for `routes: routes
})

// 导出路由
export default router