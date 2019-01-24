<style lang="stylus">
.app-main {
  background: #f0f4fc
}

.dashboard-container {
  padding 20px
  background: #f0f4fc
  width 100%
  height 100%

  .item {
    width 300px
    height 100px
    margin 20px
    box-shadow 1px 2px 16px #bbbbbb
    border-radius 10px
    color white
    line-height 100px
    padding-left 20px
    text-align center

    &.style1 {
      background: linear-gradient(to right top, #2bc6dd, #4987fd)
    }

    &.style2 {
      background: linear-gradient(to right top, #f27fe8, #737dfe)
    }

    &.style3 {
      background: linear-gradient(to right top, #46e6ae, #03aff5)
    }

    &.style4 {
      background: linear-gradient(to right top, #fd9588, #f56cb4)
    }

    .title {
      font-size 24px
    }

    .value {
      margin 0 30px
      font-size 30px
    }
  }
}
</style>
<template>
  <div class="dashboard-container flex-row justify-cc align-ic flex-wrap">
    <div v-for="item in list" v-bind:key="item.title" class="item " :class="item.style">
      <span class="title">{{item.title}}</span>
      <span class="value">{{item.value}}</span>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import api from '@/api/zhaopin/dashboard'

export default {
  name: 'Dashboard',
  components: {adminDashboard, editorDashboard},
  data() {
    return {
      currentRole: 'adminDashboard',
      list: []
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  async created() {
    let json = await api.values()
    if (json.code === 0) {
      this.list = [
        {title: '用户数', value: json.data[0], style: 'style1'},
        {title: '客户总数', value: json.data[1], style: 'style2'},
        {title: '盈收总额', value: json.data[2], style: 'style3'},
        {title: '返佣总额', value: json.data[3], style: 'style4'}
      ]
    }

    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
