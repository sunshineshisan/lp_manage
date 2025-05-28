import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import main from '../views/main.vue';
// import mine from '../views/mine.vue';
import login from '../views/login.vue';

const routes = [
  {
    path: '/main',
    name: 'main',
    component: main
  },{
    path: '/login',
    name: 'login',
    component: login
  }, 
  // {
  //   path: '/mine',
  //   name: 'mine',
  //   component: () => import('../views/mine.vue')
  // }, 
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
