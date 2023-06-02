import VueRouter from 'vue-router'
import axios from 'axios'

import Layout from '../components/Layout'
import Login from '../components/Login'
import Home from '../page/Home'
import Problem from '../page/Problem'
import Goods from '../page/Goods'
import User from '../page/User'
import Employee from '../page/Employee'
import UserForm from '../page/UserForm'
import EmployeeForm from '../page/EmployeeForm'
import GoodsForm from '../page/GoodsForm'
import Password from '../page/Password'
import Information from '../page/Information'

const router = new VueRouter({
    mode: 'history',
    routes: [{
        path: '',
        component: Layout,
        children: [{
            path: '/',
            name: 'home',
            meta: { title: "首页" },
            component: Home,
        }, {
            path: '/problem',
            name: 'problem',
            meta: { title: "售后问题管理" },
            component: Problem
        }, {
            path: '/goods',
            name: 'goods',
            meta: { title: "商品管理" },
            component: Goods
        }, {
            path: '/user',
            name: 'user',
            meta: { title: "用户管理" },
            component: User
        }, {
            path: '/employee',
            name: 'employee',
            meta: { title: "员工管理" },
            component: Employee
        }, {
            path: '/information',
            name: 'information',
            meta: { title: "个人信息" },
            component: Information
        }, {
            path: '/userform',
            name: 'userForm',
            meta: { title: "用户信息" },
            component: UserForm
        }, {
            path: '/employeeform',
            name: 'employeeForm',
            meta: { title: "员工信息" },
            component: EmployeeForm
        }, {
            path: '/goodsform',
            name: 'goodsForm',
            meta: { title: "商品信息" },
            component: GoodsForm
        }]
    }, {
        path: '/login',
        name: 'login',
        meta: { title: "登录" },
        component: Login
    }, {
        path: '/password',
        name: 'password',
        meta: { title: "找回密码" },
        component: Password
    }]
})

//检查token
router.beforeEach((to,from,next) => {
    if(to.path.startsWith('/login') || to.path.startsWith('/password')){
        if(window.localStorage.getItem('accessToken')){
            next('/');
        }else{
            next();
        }
    }else{
        let token = window.localStorage.getItem('accessToken');
        if(!token){
            next('/login');
        }else{
            axios.get(
                'http://localhost:8080/lone/jwt/check',
                {
                    headers:{
                        'accessToken': token
                    }
                }
            ).then(
                response => {
                    if(!response.data){
                        next({path:'/login'})
                    }
                })
            next();
        }
    }
})

//全局后置路由
router.afterEach((to) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
})


export default router