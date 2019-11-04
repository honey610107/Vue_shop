//入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false
import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//axios请求拦截器是为了复用代码，把每个AJAX都要设置的头信息都提取到拦截器中（通过token拿数据，发送给服务器）
axios.interceptors.request.use(function(config){
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config;
},function(error){
  console.log(error)
})
Vue.prototype.$http=axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
