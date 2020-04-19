import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import router from '@/router';
import '@/styles/element-variables.scss';
import '@/styles/index.scss';

import '@/icons';

Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');