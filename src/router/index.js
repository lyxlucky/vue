import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'

// 导入全局样式
import '../assets/css/global.css'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: "/login", component: login },
        { path: "/", redirect: "/login" },
        {
            path: "/home",
            component: home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: welcome },
                { path: '/users', component: users }
            ]
        }
    ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    //  to 要访问的路劲
    // 代表从哪个路劲跳转而来
    // next是一个函数，表示放行
    // next() 放行 next("/login") 强制跳转到login页面

    if (to.path == "/login") return next()
        // 获取token
    const token = window.sessionStorage.getItem("token")
    if (token) {
        next()
    } else {
        next("/login")
    }
})

export default router