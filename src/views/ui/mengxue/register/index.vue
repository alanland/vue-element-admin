<style lang="stylus" scoped>

</style>

<template>
  <div class="page page-user">
    <sticky ref="filterForm" :model="form" class-name="filter-container flex-row flex-wrap full-width">
      <div class="filters">
      </div>
      <div class="buttons flex-row">
        <el-button type="primary" @click="getList">查询</el-button>
      </div>
    </sticky>

    <div class="content-container">
      <el-table v-loading="listLoading" ref="multipleTable" :data="list" :stripe="true" tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column v-for="col in cols" :prop="col[0]" :label="col[1]"
                         ></el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"
                  @pagination="getList"/>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import ListMixin from '@/mixins/list'
import RoleMixin from '@/mixins/role'
import api from '@/api/mengxue/register'

export default {
  components: {Sticky},
  mixins: [ListMixin, RoleMixin],
  data() {
    return {
      api,
      cols: [
        ['tagName', '场次'], ['tagPrice', '价格'], ['count', '数量'],
        ['usernames', '姓名'],
        ['phone', '电话'], ['mail', '邮件'], ['wxcode', '微信号'], ['sname', '学校'], ['scity', '城市'],
        ['sq1', '如何结缘'], ['sq2', '早幼教培训和专业背景'], ['sq3', '如何得知'], ['sq4', '希望应用那些技能']],
      defaultListQuery: {
        page: 1,
        size: 100,
        city: undefined,
        district: undefined,
        area1: undefined, // [100,999,'between:int']
        sort: 'hintCode,asc'
      },

      roleOptions: []
    }
  },
  async created() {
  },
  methods: {}
}

</script>
