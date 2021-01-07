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
    component: () => import(/* webpackchunkName: 'menu-create-edit' */ '@/views/menu/create.vue')
  }, {
    path: '/menu/:id/edit',
    name: 'menu-edit',
    component: () => import(/* webpackchunkName: 'menu-create-edit' */ '@/views/menu/edit.vue')
  }, {
    path: '/role/:roleId/alloc-menu',
    name: 'alloc-menu',
    component: () => import(/* webpackchunkName: 'alloc-menu' */ '@/views/role/alloc-menu.vue'),
    props: true
  }, {
    path: '/resource',
    name: 'resource',
    component: () => import(/* webpackchunkName: 'resource' */ '@/views/resource/index.vue')
  }, {
    path: '/course',
    name: 'course',
    component: () => import(/* webpackchunkName: 'course' */ '@/views/course/index.vue')
  }, {
    path: '/course-create',
    name: 'course-create',
    component: () => import(/* webpackchunkName: 'course-create' */ '@/views/course/create.vue')
  }, {
    path: '/course/:courseId/edit',
    name: 'course-edit',
    component: () => import(/* webpackchunkName: 'course-edit' */ '@/views/course/edit.vue'),
    props: true
  }, {
    path: '/course/:courseId/section',
    name: 'course-section',
    component: () => import(/* webpackchunkName: 'course-section' */ '@/views/course/section.vue'),
    props: true
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
