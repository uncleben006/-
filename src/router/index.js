import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import boardGame from '@/components/boardGame'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'boardGame',
      component: boardGame
    }
  ]
})
