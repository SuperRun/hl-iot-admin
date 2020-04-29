import Vue from 'vue';
import App from './App.vue';
import store from './store';
import ElementUI from 'element-ui';
import router from '@/router';

import '@/styles/element-variables.scss';
import '@/styles/index.scss';
import '@/icons';

import './permission';
import * as filters from './filters/index';
console.log (filters);

Object.keys (filters).forEach (key => {
  Vue.filter (key, filters[key]);
});

Vue.config.productionTip = false;
Vue.use (ElementUI);
new Vue ({
  router,
  store,
  render: h => h (App),
}).$mount ('#app');
