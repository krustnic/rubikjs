import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/HomePage.vue';
import Debug from './views/DebugPage.vue';
import Colors from './views/ColorPage.vue';
import Test from './views/TestPage.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/test',
      name: 'test',
      component: Test,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/debug',
      name: 'debug',
      component: Debug,
    },
    {
      path: '/colors',
      name: 'colors',
      component: Colors,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
