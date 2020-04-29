import router from './router';
import store from './store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {getToken} from '@/utils/auth';

NProgress.configure ({showSpinner: false});

const whiteList = ['/login'];

router.beforeEach (async (to, from, next) => {
  // start progress bar
  NProgress.start ();

  const hasToken = getToken ();
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next ({path: '/'});
      NProgress.done ();
    } else {
      next ();
    }
  } else {
    if (whiteList.indexOf (to.path) !== -1) {
      next ();
    } else {
      next (`/login?redirect=${to.path}`);
      NProgress.done ();
    }
  }
});

router.afterEach (() => {
  // finish progress bar
  NProgress.done ();
});
