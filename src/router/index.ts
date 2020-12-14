import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [{
  path: '/login',
  name: 'login',
  component: () => import(/* webpackchunkName: 'login' */ '@/views/login/index.vue')
}, {
  path: '/',
  component: Layout,
  meta: {
    requiresAuth: true
  },
  children: [{
    path: '/',
    name: 'home',
    component: () => import(/* webpackchunkName: 'home' */ '@/views/home/index.vue')
  }, {
    path: '/role',
    name: 'role',
    component: () => import(/* webpackchunkName: 'role' */ '@/views/role/index.vue')
  }, {
    path: '/menu',
    name: 'menu',
    component: () => import(/* webpackchunkName: 'menu' */ '@/views/menu/index.vue')
  }, {
    path: '/menu/create',
    name: 'menu-create',
    component: () => import(/* webpackchunkName: 'menu-create' */ '@/views/menu/create.vue')
  }, {
    path: '/resource',
    name: 'resource',
    component: () => import(/* webpackchunkName: 'resource' */ '@/views/resource/index.vue')
  }, {
    path: '/course',
    name: 'course',
    component: () => import(/* webpackchunkName: 'course' */ '@/views/course/index.vue')
  }, {
    path: '/user',
    name: 'user',
    component: () => import(/* webpackchunkName: 'user' */ '@/views/user/index.vue')
  }, {
    path: '/advert',
    name: 'advert',
    component: () => import(/* webpackchunkName: 'advert' */ '@/views/advert/index.vue')
  }, {
    path: '/advert-space',
    name: 'advert-space',
    component: () => import(/* webpackchunkName: 'advert-space' */ '@/views/advert-space/index.vue')
  }]
}, {
  path: '*',
  name: '404',
  component: () => import(/* webpackchunkName: '404' */ '@/views/error-page/404.vue')
}]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
