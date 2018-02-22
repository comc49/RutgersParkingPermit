import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import HomePage from '@/components/HomePage'
import ErrorPage from '@/components/ErrorPage'
import Form from '@/components/Form'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/form',
      name: 'Form',
      component: Form
    },
    {
      path: '/error',
      name: 'ErrorPage',
      component: ErrorPage
    }
  ]
})
