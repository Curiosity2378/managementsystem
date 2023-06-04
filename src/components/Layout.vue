<template>
  <div class="base">
    <Navigation />
    <Header />
    <div class="layout" :class="{ small: isCollapse }">
      <keep-alive :include="['My-User', 'My-Employee']">
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation.vue'
import Header from './Header.vue'
import { mapState, mapMutations } from 'vuex'
import axios from 'axios'

export default {
  name: "My-Layout",
  components: {
    Navigation,
    Header
  },
  computed: {
    ...mapState(['isCollapse']),
  },
  methods: {
    ...mapMutations(['CHANGEMANAGE']),
  },
  created() {
    let username = localStorage.getItem('username');
    axios.get(
      `/employee/${username}`
    ).then(
      response => {
        let manage = response.data.isManage
        this.CHANGEMANAGE(manage)
      }
    )
  }
}
</script>

<style>
html {
  background-color: #f5f5f5;
}

.layout {
  padding-left: 200px;
  margin: 10px;
  margin-bottom: 0px;
}

.small {
  padding-left: 64px;
}
</style>

