import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api'

import '@/assets/icons/style.css';
Vue.config.productionTip = false

// 注册到原型上，在组件里可以 this.$api调用
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
