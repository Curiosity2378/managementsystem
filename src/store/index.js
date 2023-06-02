import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'

Vue.use(Vuex)

//准备actions-用于响应组件中的动作
const actions = {
    rulePm(context, value) {
        if (context.state.sum % 2 === 0) {
            context.commit('MINUS', value);
        } else {
            context.commit('PLUS', value);
        }
    },
}

//准备mutations-用于操作数据
const mutations = {
    CHANGENav(state, value) {
        state.isCollapse = value
    },
    CHANGEMANAGE(state, value) {
        state.manage = value;
    },
}

//准备state-用于存储数据
const state = {
    isCollapse: false,
    manage: false
}



//创建并暴露store
export default new Vuex.Store({
    actions,
    mutations,
    state
})