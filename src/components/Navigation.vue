<template>
    <el-row class="tac">
        <el-col :span="12">
            <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :collapse-transition=false
                background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router :collapse="isCollapse">
                <el-menu-item>
                    <span>企业售后问题管理系统</span>
                </el-menu-item>
                <el-menu-item index="/">
                    <i class="el-icon-menu"></i>
                    <span slot="title">首页</span>
                </el-menu-item>
                <el-menu-item index="/problem">
                    <i class="el-icon-s-comment"></i>
                    <span slot="title">售后管理</span>
                </el-menu-item>
                <el-menu-item index="/goods">
                    <i class="el-icon-s-goods"></i>
                    <span slot="title">商品管理</span>
                </el-menu-item>
                <el-menu-item index="/user">
                    <i class="el-icon-user-solid"></i>
                    <span slot="title">用户管理</span>
                </el-menu-item>
                <el-menu-item index="/employee" :disabled=!manage>
                    <i class="el-icon-service"></i>
                    <span slot="title">员工管理</span>
                </el-menu-item>
                <el-menu-item index="/information">
                    <i class="el-icon-info"></i>
                    <span slot="title">个人信息</span>
                </el-menu-item>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'My-Navigation',
    computed: {
        ...mapState(['isCollapse', 'manage']),
    }
}
</script>

<style scoped>
.el-menu-vertical-demo {
    border-right: 0px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>
  