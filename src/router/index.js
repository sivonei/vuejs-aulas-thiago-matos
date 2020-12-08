import Vue from 'vue'
import Router from 'vue-router'
import githubissues from '@/components/githubissues'
import getissue from '@/components/getissue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'githubissues',
      component: githubissues,
    },
    {
      path: '/:name/:repo/:problema',
      name: 'getissue',
      component: getissue,
    },
  ]
})
