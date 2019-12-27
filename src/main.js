import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'
import AOS from 'aos'


import 'aos/dist/aos.css'
import 'normalize.css';
import './assets/styles/index.scss';

Vue.config.productionTip = false
Vue.use(VueLazyload)

new Vue({
  created () {
    AOS.init()
  },
  router,
  render: h => h(App)
}).$mount('#app')





