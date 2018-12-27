<style lang="stylus">
.page-member-detail {

}
</style>
<template>
<div class="page-position-detail">
  <el-row :gutter="10">
    <el-col :span="6">Name：{{position.name}}</el-col>
  </el-row>
</div>
</template>
<script>
import api from '@/api/zhaopin/position'

export default {
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      position: {}
    }
  },
  async created() {
    const res = await api.get(this.id)
    this.position = res.data
  }
}
</script>
