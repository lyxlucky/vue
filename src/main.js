import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import { MessageBox } from 'element-ui';

Vue.config.productionTip = false
    // 默认账号密码 admin 123456 配置请求根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
    console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem("token")
        // 必须return
    return config
})
Vue.prototype.$http = axios

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')