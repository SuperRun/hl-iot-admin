import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken } from '@/utils/auth';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  const hasToken = getToken();
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' });
      NProgress.done();
    } else {
      const hasRoles = store.getters.routes && store.getters.routes.length > 0;
      if (hasRoles) {
        next();
      } else {
        try {
          const role_id = store.getters.userInfo.role_id;
          console.log('role_id', role_id);
          const routes = await store.dispatch('user/userRole', {
            role_id,
          });
          const filterRoutes = await store.dispatch('user/dealRoutes', routes);
          console.log('filterRoutes', filterRoutes);
          router.addRoutes(filterRoutes);
          next({ ...to, replace: true });
        } catch (error) {
          await store.dispatch('user/resetToken');
          Message.error(error || 'Has Error');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
