import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/Index.vue';
import Details from '../views/Details.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    {
      path: '/details/:id',
      name: 'Details',
      component: Details,
    },
  ],
});

export default router;
