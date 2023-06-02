<template>
    <div class="header" :class="{ small: isCollapse }">
        <div class="open">
            <i class="el-icon-s-fold" v-show="!isCollapse" @click.prevent="CHANGENav(true)"></i>
            <i class="el-icon-s-unfold" v-show="isCollapse" @click.prevent="CHANGENav(false)"></i>
        </div>
        <div class="right">
            <span class="login">欢迎&nbsp;{{ username }}</span>&nbsp;|
            <span class="el-icon-switch-button" @click="exit()"></span>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    name: "My-Header",
    computed: {
        ...mapState(['isCollapse']),
        username() {
            return localStorage.getItem('username');
        }
    },
    methods: {
        ...mapMutations(['CHANGENav']),
        exit() {
            localStorage.removeItem('username');
            localStorage.removeItem('accessToken');
            this.$router.replace({
                name: 'login'
            })
        }
    }
}
</script>

<style scoped>
.header {
    line-height: 50px;
    height: 50px;
    padding-left: 200px;
    color: #fff;
    background-color: #1f9fff;
}

.open {
    font-size: 30px;
    cursor: pointer;
}

.right {
    position: fixed;
    top: 0;
    right: 30px;
}

.small {
    padding-left: 64px;
}
</style>