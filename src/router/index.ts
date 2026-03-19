import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/views/Layout.vue';
import { store } from '@/store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'Home', component: () => import('@/views/ViewerPage.vue') },
        { path: ':pathMatch(.*)', component: () => import('@/views/ViewerPage.vue') },
      ],
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth === true);
  const isLogin = to.name === 'Login';

  if (store.getters.isAuthenticated && isLogin) {
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/';
    next(redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/');
    return;
  }

  if (!requiresAuth) {
    next();
    return;
  }

  if (store.getters.isAuthenticated) {
    next();
    return;
  }

  next({ name: 'Login', query: { redirect: to.fullPath } });
});

export { router };
