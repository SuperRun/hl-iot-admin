import Vue from 'vue';
import App from './App.vue';
import store from './store';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/zh-CN';
import router from '@/router';
import {getToken} from '@/utils/auth';

import '@/styles/element-variables.scss';
import '@/styles/index.scss';
import '@/icons';

import './permission';
import UploadMixiin from './upload';
import * as filters from './filters/index';

Object.keys (filters).forEach (key => {
  Vue.filter (key, filters[key]);
});

Vue.mixin (UploadMixiin);
Vue.use (ElementUI, {locale});
Vue.config.productionTip = false;

new Vue ({
  router,
  store,
  render: h => h (App),
}).$mount ('#app');
