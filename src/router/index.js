import Vue from 'vue'
import Router from 'vue-router'
import Client from '@/components/Client'
import SendMsg from '@/components/SendMsg'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'send-msg',
      component: SendMsg
    },
    {
      path: '/client',
      name: 'Client',
      component: Client
    }
  ]
})
