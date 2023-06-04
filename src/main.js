import Vue from 'vue'
import App from './App.vue'
//引入store
import store from "./store"
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui'
import 'normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

axios.defaults.baseURL = '/lone'
Vue.prototype.$http = axios

axios.interceptors.request.use(config => {
  config.headers.accessToken = window.localStorage.getItem('accessToken')
  return config
})

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  },
}).$mount('#app')
