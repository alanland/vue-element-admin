<style lang="stylus">
.page-member-detail {

}
</style>
<template>
<div class="page-member-detail">
  <el-row :gutter="10">
    <el-col :span="6">Name：{{member.name}}</el-col>
  </el-row>
</div>
</template>
<script>
import api from '@/api/zhaopin/member'

export default {
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      member: {}
    }
  },
  async created() {
    const res = await api.get(this.id)
    this.member = res.data
  }
}
</script>
